package com.phongdnh.se121.services.file;

import com.phongdnh.se121.constants.MinIOConstant;
import com.phongdnh.se121.dtos.general.PresignedURLResponse;
import com.phongdnh.se121.exceptions.errors.ApiException;
import com.phongdnh.se121.exceptions.errors.ErrorCode;
import io.minio.CopyObjectArgs;
import io.minio.CopySource;
import io.minio.GetObjectArgs;
import io.minio.GetPresignedObjectUrlArgs;
import io.minio.MinioClient;
import io.minio.RemoveObjectArgs;
import io.minio.StatObjectArgs;
import io.minio.http.Method;
import java.io.InputStream;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class MinIOStorageProvider implements StorageProvider {
  private final MinioClient minioClient;

  @Override
  public PresignedURLResponse generatePresignedUploadURL(String originalName) {
    String objectKey = System.currentTimeMillis() + "-" + originalName;
    try {
      String url =
          minioClient.getPresignedObjectUrl(
              GetPresignedObjectUrlArgs.builder()
                  .bucket(MinIOConstant.MINIO_QUARANTINE_BUCKET)
                  .object(objectKey)
                  .method(Method.PUT)
                  .expiry(5, TimeUnit.MINUTES)
                  .build());
      return PresignedURLResponse.builder()
          .key(objectKey)
          .url(url)
          .expirationInSeconds(300)
          .build();
    } catch (Exception e) {
      throw new ApiException(ErrorCode.UPLOAD_FAILED, Map.of("reason", e.getMessage()));
    }
  }

  @Override
  public PresignedURLResponse generatePresignedDownloadURL(String objectKey) {
    try {
      String url =
          minioClient.getPresignedObjectUrl(
              GetPresignedObjectUrlArgs.builder()
                  .bucket(MinIOConstant.MINIO_MAIN_BUCKET)
                  .object(objectKey)
                  .method(Method.GET)
                  .expiry(5, TimeUnit.MINUTES)
                  .build());
      return PresignedURLResponse.builder()
          .key(objectKey)
          .url(url)
          .expirationInSeconds(300)
          .build();
    } catch (Exception e) {
      throw new ApiException(ErrorCode.DOWNLOAD_FAILED, Map.of("reason", e.getMessage()));
    }
  }

  @Override
  public void delete(String objectKey) {
    try {
      minioClient.removeObject(
          RemoveObjectArgs.builder()
              .bucket(MinIOConstant.MINIO_MAIN_BUCKET)
              .object(objectKey)
              .build());
    } catch (Exception e) {
      throw new ApiException(ErrorCode.INTERNAL_SERVER_ERROR, Map.of("reason", e.getMessage()));
    }
  }

  @Override
  public boolean exists(String objectKey) {
    try {
      minioClient.statObject(
          StatObjectArgs.builder()
              .bucket(MinIOConstant.MINIO_MAIN_BUCKET)
              .object(objectKey)
              .build());
      return true;
    } catch (Exception e) {
      return false;
    }
  }

  @Override
  public String uploadStream(String objectKey, String contentType, InputStream inputStream) {
    throw new UnsupportedOperationException("Not implemented yet");
  }

  @Override
  public InputStream downloadStream(String objectKey) {
    try {
      return minioClient.getObject(
          GetObjectArgs.builder()
              .bucket(MinIOConstant.MINIO_MAIN_BUCKET)
              .object(objectKey)
              .build());
    } catch (Exception e) {
      throw new ApiException(ErrorCode.INTERNAL_SERVER_ERROR, Map.of("reason", e.getMessage()));
    }
  }

  @Override
  public InputStream downloadFromQuarantineStream(String objectKey) {
    try {
      return minioClient.getObject(
          GetObjectArgs.builder()
              .bucket(MinIOConstant.MINIO_QUARANTINE_BUCKET)
              .object(objectKey)
              .build());
    } catch (Exception e) {
      throw new ApiException(ErrorCode.INTERNAL_SERVER_ERROR, Map.of("reason", e.getMessage()));
    }
  }

  @Override
  public void promoteFromQuarantine(String objectKey) {
    try {
      minioClient.copyObject(
          CopyObjectArgs.builder()
              .source(
                  CopySource.builder()
                      .bucket(MinIOConstant.MINIO_QUARANTINE_BUCKET)
                      .object(objectKey)
                      .build())
              .bucket(MinIOConstant.MINIO_MAIN_BUCKET)
              .object(objectKey)
              .build());
      minioClient.removeObject(
          RemoveObjectArgs.builder()
              .bucket(MinIOConstant.MINIO_QUARANTINE_BUCKET)
              .object(objectKey)
              .build());
    } catch (Exception e) {
      throw new ApiException(ErrorCode.INTERNAL_SERVER_ERROR, Map.of("reason", e.getMessage()));
    }
  }
}
