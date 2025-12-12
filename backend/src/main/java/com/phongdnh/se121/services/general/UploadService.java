package com.phongdnh.se121.services.general;

import com.phongdnh.se121.dtos.general.MediaResponse;
import com.phongdnh.se121.dtos.general.UploadConfirmRequest;
import com.phongdnh.se121.dtos.general.UploadSignatureResponse;
import com.phongdnh.se121.entities.general.Media;
import com.phongdnh.se121.enums.general.MediaEntityType;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;

public interface UploadService {
  List<MediaResponse> findAll(Specification<Media> mediaSpecification);

  void deleteFile(Long mediaId);

  void deleteAllByEntity(MediaEntityType entityType, Long entityId);

  // Theo luồng DRIRECT UPLOAD
  UploadSignatureResponse getUploadSignature();

  List<MediaResponse> confirmUpload(
      List<UploadConfirmRequest> request, MediaEntityType entityType, Long entityId);

  void cronDeleteUnused();
}
