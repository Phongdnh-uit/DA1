package com.phongdnh.se121.services.file;

import com.phongdnh.se121.dtos.general.PresignedURLResponse;
import java.io.InputStream;

public interface StorageProvider {

  /** Generates a presigned URL for uploading a file to quarantine bucket. */
  PresignedURLResponse generatePresignedUploadURL(String originalName);

  PresignedURLResponse generatePresignedDownloadURL(String objectKey);

  void delete(String objectKey);

  boolean exists(String objectKey);

  // (Optional) Only use for small files
  String uploadStream(String objectKey, String contentType, InputStream inputStream);

  // (Optional) Only use for small files
  InputStream downloadStream(String objectKey);

  InputStream downloadFromQuarantineStream(String objectKey);

  /** Promotes an object from the quarantine bucket to the main bucket. */
  void promoteFromQuarantine(String objectKey);
}
