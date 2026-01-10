package com.phongdnh.se121.kafka.consumers;

import com.phongdnh.se121.constants.MinIOConstant;
import com.phongdnh.se121.exceptions.errors.ApiException;
import com.phongdnh.se121.services.file.FileOrchestratorService;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Component;

@Slf4j
@RequiredArgsConstructor
@Component
public class MinIONotificationListener {
  private final FileOrchestratorService fileOrchestratorService;

  @KafkaListener(
      id = "minio-notification-listener",
      topics = MinIOConstant.MINIO_KAFKA_TOPIC,
      groupId = "minio-notification-group")
  public void listenMinIONotifications(Map<String, Object> message, Acknowledgment acknowledgment) {
    log.info("Processing MinIO notification: {}", message);
    String eventName = (String) message.get("EventName");
    if (!"s3:ObjectCreated:Put".equals(eventName)) {
      acknowledgment.acknowledge();
      return;
    }

    List<Map<String, Object>> records = (List<Map<String, Object>>) message.get("Records");
    if (records == null || records.isEmpty()) {
      log.warn("No records found in message");
      acknowledgment.acknowledge();
      return;
    }

    Map<String, Object> record = records.get(0);
    Map<String, Object> s3 = (Map<String, Object>) record.get("s3");
    String bucketName = (String) ((Map<String, Object>) s3.get("bucket")).get("name");
    if (!MinIOConstant.MINIO_QUARANTINE_BUCKET.equals(bucketName)) {
      acknowledgment.acknowledge();
      return;
    }
    Map<String, Object> objectMap = (Map<String, Object>) s3.get("object");
    String encodedKey = (String) objectMap.get("key");
    String objectKey = URLDecoder.decode(encodedKey, StandardCharsets.UTF_8);
    CompletableFuture.runAsync(
            () -> {
              try {

                fileOrchestratorService.processFile(objectKey);
              } catch (ApiException e) {
                log.error("API error processing file with key {}: {}", objectKey, e.toString());
              } catch (Exception e) {
                log.error(
                    "Unexpected error processing file with key {}: {}", objectKey, e.getMessage());
              }
            })
        .thenRun(acknowledgment::acknowledge)
        .exceptionally(
            ex -> {
              ex.printStackTrace();
              return null;
            });
  }
}
