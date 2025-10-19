package com.phongdnh.se121.services.general;

import com.phongdnh.se121.dtos.general.MediaResponse;
import com.phongdnh.se121.dtos.general.UploadConfirmRequest;
import com.phongdnh.se121.dtos.general.UploadSignatureResponse;
import com.phongdnh.se121.enums.general.MediaEntityType;
import java.util.List;

public interface UploadService {

  void deleteFile(Long mediaId);

  void deleteAllByEntity(MediaEntityType entityType, Long entityId);

  // Theo luồng DRIRECT UPLOAD
  UploadSignatureResponse getUploadSignature();

  List<MediaResponse> confirmUpload(
      List<UploadConfirmRequest> request, MediaEntityType entityType, Long entityId);

  void cronDeleteUnused();
}
