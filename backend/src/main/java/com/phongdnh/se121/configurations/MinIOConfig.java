package com.phongdnh.se121.configurations;

import io.minio.MinioClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MinIOConfig {

  @Value("${minio.host}")
  private String minIOHost;

  @Value("${minio.port}")
  private String minIOPort;

  @Value("${minio.credentials.username}")
  private String minIOUsername;

  @Value("${minio.credentials.password}")
  private String minIOPassword;

  @Bean
  MinioClient minioClient() {
    return MinioClient.builder()
        .endpoint(minIOHost + ":" + minIOPort)
        .credentials(minIOUsername, minIOPassword)
        .build();
  }
}
