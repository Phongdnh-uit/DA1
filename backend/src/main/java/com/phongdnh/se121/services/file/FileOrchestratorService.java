package com.phongdnh.se121.services.file;

import com.phongdnh.se121.dtos.general.PresignedURLResponse;
import com.phongdnh.se121.dtos.general.PresignedUploadRequest;
import com.phongdnh.se121.dtos.general.PresignedUploadResponse;

public interface FileOrchestratorService {
  PresignedUploadResponse generatePresignedUploadURL(PresignedUploadRequest request);

  PresignedURLResponse generatePresignedDownURL(String objectKey, String options);

  void processFile(String objectKey);

  void deleteFile(String objectKey);

  void cronjobCleanupOrphanedFiles();
}
