package com.phongdnh.se121.hooks.property;

import com.phongdnh.se121.ai.RAGIngestionService;
import com.phongdnh.se121.dtos.property.PropertyRequest;
import com.phongdnh.se121.dtos.property.PropertyResponse;
import com.phongdnh.se121.entities.general.File;
import com.phongdnh.se121.entities.property.Property;
import com.phongdnh.se121.entities.property.PropertyFile;
import com.phongdnh.se121.enums.general.FilePurpose;
import com.phongdnh.se121.enums.general.FileUsageStatus;
import com.phongdnh.se121.enums.general.MediaEntityType;
import com.phongdnh.se121.exceptions.errors.ApiException;
import com.phongdnh.se121.exceptions.errors.ErrorCode;
import com.phongdnh.se121.hooks.DefaultHook;
import com.phongdnh.se121.repositories.general.FileRepository;
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
import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Component
public class PropertyHook extends DefaultHook<Property, Long, PropertyRequest, PropertyResponse> {
  private final PropertyTypeRepository propertyTypeRepository;
  private final WardRepository wardRepository;
  private final ProvinceRepository provinceRepository;
  private final UploadService uploadService;
  private final RAGIngestionService ragIngestionService;
  private final GeometryFactory geometryFactory;
  private final FileRepository fileRepository;
  private final PropertyRepository propertyRepository;

  // ============================ ENRICH ============================

  @Override
  @Transactional
  public void enrichCreate(PropertyRequest input, Property entity, Map<String, Object> context) {
    enrich(input, entity, context);
  }

  @Override
  @Transactional
  public void enrichUpdate(PropertyRequest input, Property entity, Map<String, Object> context) {
    enrich(input, entity, context);
  }

  // ============================ VALIDATE ============================

  @Override
  public void validateCreate(PropertyRequest input, Map<String, Object> context) {
    validate(input, context);
    context.put("request", input);
  }

  @Override
  public void validateUpdate(
      Long id, PropertyRequest input, Property existingEntity, Map<String, Object> context) {
    validate(input, context);
    context.put("request", input);
  }

  // ============================ AFTER ============================

  @Override
  public void afterCreate(Property entity, PropertyResponse response, Map<String, Object> context) {
    // Ingest to RAG system
    ragIngestionService.ingestProperty(entity);
  }

  @Override
  public void afterUpdate(Property entity, PropertyResponse response, Map<String, Object> context) {
    // Ingest to RAG system
    ragIngestionService.updatePropertyIngestion(entity);
  }

  @Override
  public void validateBulkDelete(Iterable<Long> ids) {
    List<Property> properties = propertyRepository.findAllById((Iterable<Long>) ids);
    var files =
        properties.stream()
            .flatMap(property -> property.getFiles().stream())
            .map(PropertyFile::getFile)
            .toList();
    files.stream().forEach(file -> file.setUsageStatus(FileUsageStatus.NOT_IN_USE));
    fileRepository.saveAll(files);
  }

  @Override
  public void validateDelete(Long id) {
    Property property =
        propertyRepository
            .findById(id)
            .orElseThrow(
                () -> new ApiException(ErrorCode.RESOURCE_NOT_FOUND, "Property not found"));
    var files = property.getFiles().stream().map(PropertyFile::getFile).toList();
    files.stream().forEach(file -> file.setUsageStatus(FileUsageStatus.NOT_IN_USE));
    fileRepository.saveAll(files);
  }

  // ============================ AFTER ============================

  @Override
  public void afterBulkDelete(Iterable<Long> ids) {
    for (Long propertyId : ids) {
      ragIngestionService.deletePropertyIngestion(propertyId);
    }
  }

  @Override
  public void afterDelete(Long id) {
    ragIngestionService.deletePropertyIngestion(id);
  }

  // ============================ HELPER ============================

  private void validate(PropertyRequest request, Map<String, Object> context) {
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

    // Validate thumbnail file: Must exist and belong to the user with purpose THUMBNAIL
    File thumbnailFile =
        fileRepository
            .findById(request.getThumbnailId())
            .orElseThrow(
                () ->
                    new ApiException(
                        ErrorCode.RESOURCE_NOT_FOUND,
                        Map.of("thumbnailId", "Thumbnail file not found")));
    Long userId = SecurityUtil.getCurrentUserId();
    if (!thumbnailFile.getCreatedBy().equals(userId)
        || thumbnailFile.getPurpose() != FilePurpose.PROPERTY_THUMBNAIL) {
      errors.put("thumbnailId", "Invalid thumbnail file");
    }

    // forward to next steps
    context.put("thumbnailFile", thumbnailFile);
    if (!errors.isEmpty()) {
      throw new ApiException(ErrorCode.VALIDATION_ERROR, errors);
    }
  }

  private void enrich(PropertyRequest input, Property entity, Map<String, Object> context) {
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

    List<File> filesToRevoke = new ArrayList<>();
    // set thumbnail file, revoke previous if any
    File newThumbnailFile = (File) context.get("thumbnailFile");
    File oldThumbnailFile =
        entity.getFiles().stream()
            .filter(
                propertyFile ->
                    propertyFile.getFile().getPurpose() == FilePurpose.PROPERTY_THUMBNAIL)
            .map(PropertyFile::getFile)
            .findFirst()
            .orElse(null);
    if (oldThumbnailFile != null && !newThumbnailFile.getId().equals(oldThumbnailFile.getId())) {
      // revoke old thumbnail
      oldThumbnailFile.setUsageStatus(FileUsageStatus.NOT_IN_USE);
      filesToRevoke.add(oldThumbnailFile);
    }

    // set gallery files, revoke previous if any
    List<File> newGalleries =
        fileRepository.findAll(
            (root, _, builder) ->
                builder.and(
                    root.get("id")
                        .in(input.getGalleryIds() != null ? input.getGalleryIds() : List.of()),
                    builder.equal(root.get("purpose"), FilePurpose.PROPERTY_GALLERY),
                    builder.equal(root.get("createdBy"), userId)));
    List<File> oldGalleries =
        entity.getFiles().stream()
            .filter(
                propertyFile -> propertyFile.getFile().getPurpose() == FilePurpose.PROPERTY_GALLERY)
            .map(PropertyFile::getFile)
            .toList();
    // revoke old galleries that are not in the new list
    for (File oldGallery : oldGalleries) {
      if (newGalleries.stream().noneMatch(file -> file.getId().equals(oldGallery.getId()))) {
        oldGallery.setUsageStatus(FileUsageStatus.NOT_IN_USE);
        filesToRevoke.add(oldGallery);
      }
    }

    // set documents
    List<File> newDocuments =
        fileRepository.findAll(
            (root, _, builder) ->
                builder.and(
                    root.get("id")
                        .in(input.getDocumentIds() != null ? input.getDocumentIds() : List.of()),
                    builder.equal(root.get("purpose"), FilePurpose.PROPERTY_FILE),
                    builder.equal(root.get("createdBy"), userId)));
    List<File> oldDocuments =
        entity.getFiles().stream()
            .filter(
                propertyFile -> propertyFile.getFile().getPurpose() == FilePurpose.PROPERTY_FILE)
            .map(PropertyFile::getFile)
            .toList();
    // revoke old documents that are not in the new list
    for (File oldDocument : oldDocuments) {
      if (newDocuments.stream().noneMatch(file -> file.getId().equals(oldDocument.getId()))) {
        oldDocument.setUsageStatus(FileUsageStatus.NOT_IN_USE);
        filesToRevoke.add(oldDocument);
      }
    }

    // clear existing files
    entity.getFiles().clear();
    // add new files
    List<File> allNewFiles = new ArrayList<>();
    allNewFiles.add(newThumbnailFile);
    allNewFiles.addAll(newGalleries);
    allNewFiles.addAll(newDocuments);
    List<PropertyFile> propertyFiles =
        allNewFiles.stream()
            .map(
                file -> {
                  PropertyFile propertyFile = new PropertyFile();
                  propertyFile.setProperty(entity);
                  propertyFile.setFile(file);
                  return propertyFile;
                })
            .toList();
    entity.getFiles().addAll(propertyFiles);
    // set new files to IN_USE
    allNewFiles.forEach(file -> file.setUsageStatus(FileUsageStatus.IN_USE));
    // save revoked files
    fileRepository.saveAll(filesToRevoke);
    // No cascade, so need to save new files explicitly
    fileRepository.saveAll(allNewFiles);
  }
}
