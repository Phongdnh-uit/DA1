package com.phongdnh.se121.hooks.property;

import com.phongdnh.se121.dtos.PageResponse;
import com.phongdnh.se121.dtos.general.MediaResponse;
import com.phongdnh.se121.dtos.property.PropertyRequest;
import com.phongdnh.se121.dtos.property.PropertyResponse;
import com.phongdnh.se121.entities.general.Media;
import com.phongdnh.se121.entities.property.Property;
import com.phongdnh.se121.enums.general.MediaEntityType;
import com.phongdnh.se121.enums.general.MediaPurpose;
import com.phongdnh.se121.exceptions.errors.ApiException;
import com.phongdnh.se121.exceptions.errors.ErrorCode;
import com.phongdnh.se121.hooks.DefaultHook;
import com.phongdnh.se121.mappers.general.MediaMapper;
import com.phongdnh.se121.repositories.general.MediaRepository;
import com.phongdnh.se121.repositories.property.PropertyTypeRepository;
import com.phongdnh.se121.repositories.property.ProvinceRepository;
import com.phongdnh.se121.repositories.property.WardRepository;
import com.phongdnh.se121.services.general.UploadService;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
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

  @Override
  public void afterCreate(Property entity, PropertyResponse response, Map<String, Object> context) {
    saveMediasAfter((PropertyRequest) context.get("request"), entity.getId(), response);
  }

  @Override
  public void afterUpdate(Property entity, PropertyResponse response, Map<String, Object> context) {
    saveMediasAfter((PropertyRequest) context.get("request"), entity.getId(), response);
  }

  @Override
  public void enrichCreate(PropertyRequest input, Property entity, Map<String, Object> context) {
    enrich(input, entity);
  }

  @Override
  public void enrichUpdate(PropertyRequest input, Property entity, Map<String, Object> context) {
    enrich(input, entity);
  }

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
    entity.setType(propertyTypeRepository.getReferenceById(input.getTypeId()));
    entity.setWard(wardRepository.getReferenceById(input.getWardId()));
  }

  private void saveMediasAfter(PropertyRequest request, Long entityId, PropertyResponse response) {
    List<MediaResponse> medias =
        uploadService.confirmUpload(request.getMedias(), MediaEntityType.PROPERTY, entityId);
    response.setMedias(medias);
  }
}
