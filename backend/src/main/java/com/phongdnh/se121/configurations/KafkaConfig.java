package com.phongdnh.se121.configurations;

import com.phongdnh.se121.constants.MinIOConstant;
import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaConfig {

  @Bean
  NewTopic minIONotificationTopic() {
    return TopicBuilder.name(MinIOConstant.MINIO_KAFKA_TOPIC)
        .partitions(MinIOConstant.MINIO_KAFKA_PARTITION)
        .replicas(MinIOConstant.MINIO_KAFKA_REPLICATION_FACTOR)
        .build();
  }
}
