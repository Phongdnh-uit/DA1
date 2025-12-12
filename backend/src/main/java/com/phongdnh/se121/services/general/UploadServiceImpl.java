package com.phongdnh.se121.services.general;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.phongdnh.se121.dtos.general.MediaResponse;
import com.phongdnh.se121.dtos.general.UploadConfirmRequest;
import com.phongdnh.se121.dtos.general.UploadSignatureResponse;
import com.phongdnh.se121.entities.general.Media;
import com.phongdnh.se121.enums.general.MediaEntityType;
import com.phongdnh.se121.exceptions.errors.ApiException;
import com.phongdnh.se121.exceptions.errors.ErrorCode;
import com.phongdnh.se121.mappers.general.MediaMapper;
import com.phongdnh.se121.repositories.general.MediaRepository;
import com.phongdnh.se121.securities.SecurityUtil;
import jakarta.transaction.Transactional;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class UploadServiceImpl implements UploadService {

  private final MediaRepository mediaRepository;
  private final Cloudinary cloudinary;
  private final MediaMapper mediaMapper;

  @Override
  public List<MediaResponse> findAll(Specification<Media> mediaSpecification) {
    List<Media> medias = mediaRepository.findAll(mediaSpecification);
    return medias.stream().map(mediaMapper::entityToResponse).toList();
  }

  @Override
  public void deleteFile(Long mediaId) {
    Media media =
        mediaRepository
            .findById(mediaId)
            .orElseThrow(() -> new ApiException(ErrorCode.RESOURCE_NOT_FOUND));
    media.setEntityId(null);
    media.setEntityType(null);
    mediaRepository.save(media);
  }

  @Override
  public UploadSignatureResponse getUploadSignature() {
    // 1. ---- Get user id to check after ----
    Long currentUser = SecurityUtil.getCurrentUserId();
    try {

      //  2. ---- Basic info for cloudinary ----
      Long timestamp = System.currentTimeMillis() / 1000L; // in seconds
      String folder = "user_uploads/" + currentUser;
      String publicId = folder + "/" + UUID.randomUUID().toString();

      // 3. ---- Additional tags ----
      List<String> tags = List.of("status:pending");

      // 4. ---- Create signature ----
      Map<String, Object> paramsToSign = new HashMap<>();
      paramsToSign.put("timestamp", timestamp);
      paramsToSign.put("folder", folder);
      paramsToSign.put("public_id", publicId);
      paramsToSign.put("tags", tags);
      paramsToSign.put("transformation", "w_1024,h_1024,c_fill,q_auto,f_auto");
      String signature =
          cloudinary.apiSignRequest(
              paramsToSign, cloudinary.config.apiSecret, cloudinary.config.signatureVersion);

      // 5. ---- Create response ----
      UploadSignatureResponse response = new UploadSignatureResponse();
      response.setApiKey(cloudinary.config.apiKey);
      response.setTimestamp(timestamp.toString());
      response.setPublicId(publicId);
      response.setCloudName(cloudinary.config.cloudName);
      response.setFolder(folder);
      response.setSignature(signature);
      response.setTags(tags);
      return response;
    } catch (Exception e) {
      throw new ApiException(ErrorCode.UPLOAD_FAILED, e.getMessage());
    }
  }

  @Transactional
  @Override
  public List<MediaResponse> confirmUpload(
      List<UploadConfirmRequest> request, MediaEntityType entityType, Long entityId) {
    Long currentUser = SecurityUtil.getCurrentUserId();
    List<Media> mediasToSave = new ArrayList<>();
    List<String> publicIdsToChangeTag = new ArrayList<>();
    for (UploadConfirmRequest r : request) {
      // pre-check
      if (r.getSignature() == null || r.getPublicId() == null || r.getVersion() == null) {
        throw new ApiException(
            ErrorCode.SIGNATURE_INVALID, "Missing fields in confirm upload request");
      }
      // 1. ---- Validate signature ----
      if (!isSignatureValid(r.getPublicId(), r.getVersion(), r.getSignature())) {
        throw new ApiException(ErrorCode.SIGNATURE_INVALID);
      }
      // 2. ---- Check if the file is uploaded by the current user ----
      String folder = "user_uploads/" + currentUser;
      if (!r.getPublicId().startsWith(folder + "/")) {
        throw new ApiException(ErrorCode.FORBIDDEN);
      }
      publicIdsToChangeTag.add(r.getPublicId());
      // 3. ---- Save to database ----
      Media media = mediaMapper.requestToEntity(r);
      media.setEntityType(entityType);
      media.setEntityId(entityId);
      mediasToSave.add(media);
    }

    // 4. ---- Save to DB ----
    mediasToSave = mediaRepository.saveAll(mediasToSave);

    // 5. ---- Change tag from "status:pending" to "status:active" ----
    if (!publicIdsToChangeTag.isEmpty()) {
      try {
        @SuppressWarnings("rawtypes")
        Map result =
            cloudinary
                .uploader()
                .replaceTag(
                    "status:active",
                    publicIdsToChangeTag.toArray(new String[0]),
                    ObjectUtils.emptyMap());
        if (result.get("public_ids") == null) {
          throw new ApiException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
      } catch (Exception e) {
        throw new ApiException(ErrorCode.INTERNAL_SERVER_ERROR);
      }
    }
    return mediasToSave.stream().map(mediaMapper::entityToResponse).toList();
  }

  private boolean isSignatureValid(String publicId, Long version, String signature) {
    TreeMap<String, Object> paramsToSign = new TreeMap<>();
    paramsToSign.put("public_id", publicId);
    paramsToSign.put("version", version);
    String expectedSignature =
        cloudinary.apiSignRequest(
            paramsToSign, cloudinary.config.apiSecret, cloudinary.config.signatureVersion);
    return expectedSignature.equals(signature);
  }

  @Override
  public void deleteAllByEntity(MediaEntityType entityType, Long entityId) {
    List<Media> medias =
        mediaRepository.findAll(
            (root, _, builder) ->
                builder.and(
                    builder.equal(root.get("entityType"), entityType),
                    builder.equal(root.get("entityId"), entityId)));
    medias.forEach(
        media -> {
          media.setEntityId(null);
          media.setEntityType(null);
        });
    mediaRepository.saveAll(medias);
  }

  @Scheduled(cron = "0 0 0 * * ?")
  @Transactional
  @Override
  public void cronDeleteUnused() {
    List<Media> unusedMedias =
        mediaRepository.findAll(
            (root, _, builder) ->
                builder.and(root.get("entityId").isNull(), root.get("entityType").isNull()));
    List<Media> toBeDeleted = new ArrayList<>();
    for (Media media : unusedMedias) {
      try {
        @SuppressWarnings("rawtypes")
        Map deleteResult =
            cloudinary.uploader().destroy(media.getPublicId(), ObjectUtils.emptyMap());
        String result = deleteResult.get("result").toString();
        if (result.equals("ok") || result.equals("not found")) {
          toBeDeleted.add(media);
        } else {
          throw new ApiException(ErrorCode.UPLOAD_FAILED, "Cloudinary delete failed");
        }
      } catch (Exception e) {
        throw new ApiException(ErrorCode.UPLOAD_FAILED, "Cloudinary delete failed");
      }
    }
    mediaRepository.deleteAll(toBeDeleted);
  }
}
