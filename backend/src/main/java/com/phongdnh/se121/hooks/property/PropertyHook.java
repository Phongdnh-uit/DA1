package com.phongdnh.se121.hooks.property;

import com.phongdnh.se121.ai.RAGIngestionService;
import com.phongdnh.se121.dtos.PageResponse;
import com.phongdnh.se121.dtos.general.MediaResponse;
import com.phongdnh.se121.dtos.general.UploadConfirmRequest;
import com.phongdnh.se121.dtos.property.PropertyRequest;
import com.phongdnh.se121.dtos.property.PropertyResponse;
import com.phongdnh.se121.entities.general.Media;
import com.phongdnh.se121.entities.property.Property;
import com.phongdnh.se121.entities.property.PropertyFile;
import com.phongdnh.se121.enums.general.FilePurpose;
import com.phongdnh.se121.enums.general.FileUsageStatus;
import com.phongdnh.se121.enums.general.MediaEntityType;
import com.phongdnh.se121.enums.general.MediaPurpose;
import com.phongdnh.se121.exceptions.errors.ApiException;
import com.phongdnh.se121.exceptions.errors.ErrorCode;
import com.phongdnh.se121.hooks.DefaultHook;
import com.phongdnh.se121.mappers.general.MediaMapper;
import com.phongdnh.se121.repositories.general.FileRepository;
import com.phongdnh.se121.repositories.general.MediaRepository;
import com.phongdnh.se121.repositories.property.PropertyRepository;
import com.phongdnh.se121.repositories.property.PropertyTypeRepository;
import com.phongdnh.se121.repositories.property.ProvinceRepository;
import com.phongdnh.se121.repositories.property.WardRepository;
import com.phongdnh.se121.securities.SecurityUtil;
import com.phongdnh.se121.services.general.UploadService;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class PropertyHook extends DefaultHook<Property, Long, PropertyRequest, PropertyResponse> {
  private final PropertyTypeRepository propertyTypeRepository;
  private final WardRepository wardRepository;
  private final ProvinceRepository provinceRepository;
  private final UploadService uploadService;
  private final MediaRepository mediaRepository;
  private final MediaMapper mediaMapper;
  private final RAGIngestionService ragIngestionService;
  private final GeometryFactory geometryFactory;
  private final FileRepository fileRepository;
  private final PropertyRepository propertyRepository;

  // ============================ ENRICH ============================

  @Override
  public void enrichFindAll(PageResponse<PropertyResponse> responses) {
    Map<Long, List<MediaResponse>> mediasMap = new HashMap<>();
    List<Long> propertyIds = responses.getContent().stream().map(PropertyResponse::getId).toList();
    if (!propertyIds.isEmpty()) {
      List<Media> medias =
          mediaRepository.findAll(
              (root, _, builder) ->
                  builder.and(
                      builder.equal(root.get("entityType"), MediaEntityType.PROPERTY),
                      root.get("entityId").in(propertyIds)));
      for (Media media : medias) {
        mediasMap
            .computeIfAbsent(media.getEntityId(), _ -> new ArrayList<>())
            .add(mediaMapper.entityToResponse(media));
      }
      for (PropertyResponse response : responses.getContent()) {
        response.setMedias(mediasMap.getOrDefault(response.getId(), new ArrayList<>()));
      }
    }
  }

  @Override
  public void enrichFindById(PropertyResponse response) {
    List<MediaResponse> medias =
        mediaRepository
            .findAll(
                (root, _, builder) ->
                    builder.and(
                        builder.equal(root.get("entityType"), MediaEntityType.PROPERTY),
                        builder.equal(root.get("entityId"), response.getId())))
            .stream()
            .map(mediaMapper::entityToResponse)
            .toList();
    response.setMedias(medias);
  }

  @Override
  public void enrichCreate(PropertyRequest input, Property entity, Map<String, Object> context) {
    enrich(input, entity);
  }

  @Override
  public void enrichUpdate(PropertyRequest input, Property entity, Map<String, Object> context) {
    enrich(input, entity);
  }

  // ============================ VALIDATE ============================

  @Override
  public void validateCreate(PropertyRequest input, Map<String, Object> context) {
    validate(input);
    context.put("request", input);
  }

  @Override
  public void validateUpdate(
      Long id, PropertyRequest input, Property existingEntity, Map<String, Object> context) {
    validate(input);
    context.put("request", input);
  }

  // ============================ AFTER ============================

  @Override
  public void afterCreate(Property entity, PropertyResponse response, Map<String, Object> context) {
    List<UploadConfirmRequest> mediasInRequest =
        ((PropertyRequest) context.get("request")).getMedias();
    List<MediaResponse> mediaResponses = saveMediasAfter(mediasInRequest, entity.getId(), response);
    response.setMedias(mediaResponses);
    // Ingest to RAG system
    ragIngestionService.ingestProperty(entity);
  }

  @Override
  public void afterUpdate(Property entity, PropertyResponse response, Map<String, Object> context) {
    List<UploadConfirmRequest> mediasInRequest =
        ((PropertyRequest) context.get("request")).getMedias();
    // before saving new medias, check old medias
    // if any old media is not in the new request, delete it
    // only need to call saveMediasAfter with new upload not in database
    // 1. get current medias
    List<Media> currentMedias =
        mediaRepository.findAll(
            (root, _, builder) ->
                builder.and(
                    builder.equal(root.get("entityType"), MediaEntityType.PROPERTY),
                    builder.equal(root.get("entityId"), entity.getId())));

    // 2. determine which medias to delete, which to keep, which to add
    Set<String> requestPulicIds =
        mediasInRequest.stream()
            .filter(m -> m.getPublicId() != null)
            .map(UploadConfirmRequest::getPublicId)
            .collect(Collectors.toSet());

    // 3. delete medias not in request
    List<Media> mediasToDelete =
        currentMedias.stream().filter(m -> !requestPulicIds.contains(m.getPublicId())).toList();
    if (!mediasToDelete.isEmpty()) {
      mediaRepository.deleteAll(mediasToDelete);
    }

    // 4. save new medias
    Set<String> currentPublicIds =
        currentMedias.stream().map(Media::getPublicId).collect(Collectors.toSet());
    List<UploadConfirmRequest> newMedias =
        mediasInRequest.stream().filter(m -> !currentPublicIds.contains(m.getPublicId())).toList();
    List<MediaResponse> mediaResponses = saveMediasAfter(newMedias, entity.getId(), response);

    // 5. combine current medias (after deletion) and new medias
    List<MediaResponse> finalMedias =
        new ArrayList<>(
            currentMedias.stream()
                .filter(m -> requestPulicIds.contains(m.getPublicId()))
                .map(mediaMapper::entityToResponse)
                .toList());
    finalMedias.addAll(mediaResponses);
    response.setMedias(finalMedias);
    // Ingest to RAG system
    ragIngestionService.updatePropertyIngestion(entity);
  }

  @Override
  public void validateBulkDelete(Iterable<Long> ids) {
    List<Property> properties = propertyRepository.findAllById((Iterable<Long>) ids);
    var documents =
        properties.stream()
            .flatMap(property -> property.getDocuments().stream())
            .map(PropertyFile::getFile)
            .toList();
    documents.stream().forEach(file -> file.setUsageStatus(FileUsageStatus.NOT_IN_USE));
    fileRepository.saveAll(documents);
  }

  @Override
  public void validateDelete(Long id) {
    Property property =
        propertyRepository
            .findById(id)
            .orElseThrow(
                () -> new ApiException(ErrorCode.RESOURCE_NOT_FOUND, "Property not found"));
    var documents = property.getDocuments().stream().map(PropertyFile::getFile).toList();
    documents.stream().forEach(file -> file.setUsageStatus(FileUsageStatus.NOT_IN_USE));
    fileRepository.saveAll(documents);
  }

  // ============================ AFTER ============================

  @Override
  public void afterBulkDelete(Iterable<Long> ids) {
    for (Long propertyId : ids) {
      ragIngestionService.deletePropertyIngestion(propertyId);
      uploadService.deleteAllByEntity(MediaEntityType.PROPERTY, propertyId);
    }
  }

  @Override
  public void afterDelete(Long id) {
    ragIngestionService.deletePropertyIngestion(id);
    uploadService.deleteAllByEntity(MediaEntityType.PROPERTY, id);
  }

  // ============================ HELPER ============================

  private void validate(PropertyRequest request) {
    Map<String, String> errors = new HashMap<>();
    if (!propertyTypeRepository.existsById(request.getTypeId())) {
      errors.put("typeId", "Invalid property type");
    }
    if (!provinceRepository.existsById(request.getProvinceId())) {
      errors.put("provinceId", "Invalid province");
    }
    if (!wardRepository.exists(
        (root, _, builder) ->
            builder.and(
                builder.equal(root.get("id"), request.getWardId()),
                builder.equal(root.get("province").get("id"), request.getProvinceId())))) {
      errors.put("wardId", "Invalid ward");
    }
    if (request.getMedias() == null
        || !request.getMedias().stream().anyMatch(m -> m.getPurpose() == MediaPurpose.THUMBNAIL)) {
      throw new ApiException(
          ErrorCode.VALIDATION_ERROR, "At least one thumbnail media is required");
    }
    if (!errors.isEmpty()) {
      throw new ApiException(ErrorCode.VALIDATION_ERROR, errors);
    }
  }

  private void enrich(PropertyRequest input, Property entity) {
    Long userId = SecurityUtil.getCurrentUserId();
    // if location is provided, set location
    if (input.getLocation() != null) {
      entity.setLocation(
          geometryFactory.createPoint(
              new Coordinate(
                  input.getLocation().getLongitude(), input.getLocation().getLatitude())));
    }

    // set other foreign keys
    entity.setType(propertyTypeRepository.getReferenceById(input.getTypeId()));
    entity.setWard(wardRepository.getReferenceById(input.getWardId()));
    entity.getDocuments().clear();
    // handle documents if any
    if (input.getDocumentIds() != null && !input.getDocumentIds().isEmpty()) {
      var documents =
          fileRepository.findAll(
              (root, _, builder) ->
                  builder.and(
                      root.get("id").in(input.getDocumentIds()),
                      builder.equal(root.get("purpose"), FilePurpose.PROPERTY_FILE),
                      builder.equal(root.get("createdBy"), userId)));
      // mark all files as USED
      documents.forEach(file -> file.setUsageStatus(FileUsageStatus.IN_USE));
      documents.forEach(
          file -> {
            PropertyFile propertyFile = new PropertyFile();
            propertyFile.setFile(file);
            propertyFile.setProperty(entity);
            entity.getDocuments().add(propertyFile);
          });
    }
  }

  private List<MediaResponse> saveMediasAfter(
      List<UploadConfirmRequest> newMedias, Long entityId, PropertyResponse response) {
    return uploadService.confirmUpload(newMedias, MediaEntityType.PROPERTY, entityId);
  }
}
