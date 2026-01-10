package com.phongdnh.se121.configurations;

import com.phongdnh.se121.constants.ErrorMessageConstants;
import com.phongdnh.se121.constants.MinIOConstant;
import com.phongdnh.se121.exceptions.errors.ApiException;
import com.phongdnh.se121.exceptions.errors.ErrorCode;
import io.minio.BucketExistsArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MinIOConfig {

  @Value("${minio.endpoint}")
  private String internalMinIOEndpoint;

  @Value("${minio.credentials.username}")
  private String minIOUsername;

  @Value("${minio.credentials.password}")
  private String minIOPassword;

  @Bean
  MinioClient minioClient() {
    MinioClient minioClient =
        MinioClient.builder()
            .endpoint(internalMinIOEndpoint)
            .credentials(minIOUsername, minIOPassword)
            .build();
    createBucketIfNotExists(minioClient, MinIOConstant.MINIO_MAIN_BUCKET);
    createBucketIfNotExists(minioClient, MinIOConstant.MINIO_QUARANTINE_BUCKET);
    return minioClient;
  }

  private void createBucketIfNotExists(MinioClient minioClient, String bucketName) {
    try {
      boolean found =
          minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build());
      if (!found) {
        minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
      }
    } catch (Exception e) {
      throw new ApiException(
          ErrorCode.INTERNAL_SERVER_ERROR,
          ErrorMessageConstants.SYSTEM_ERROR_CREATING_BUCKET + bucketName);
    }
  }
}
