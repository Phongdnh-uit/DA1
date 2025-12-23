package com.phongdnh.se121.constants;

public interface MinIOConstant {
  String MINIO_KAFKA_TOPIC = "minio-notification-topic";
  Integer MINIO_KAFKA_PARTITION = 0;
  Integer MINIO_KAFKA_REPLICATION_FACTOR = 1;

  String MINIO_QUARANTINE_BUCKET = "quarantine-bucket";
  String MINIO_MAIN_BUCKET = "main-bucket";
}
