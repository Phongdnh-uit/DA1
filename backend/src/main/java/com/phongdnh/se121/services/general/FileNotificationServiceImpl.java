package com.phongdnh.se121.services.general;

import com.phongdnh.se121.events.FileProcessedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RequiredArgsConstructor
@Service
public class FileNotificationServiceImpl implements FileNotificationService {
  private final EmitterService emitterService;

  @Override
  public SseEmitter subcribe(String objectName) {
    String eventKey = buildEventKey(objectName);
    return emitterService.createEmitter(eventKey, 5L * 60L * 1000L); // 5 minutes
  }

  @Override
  public void notifyFileProcessed(String objectName, FileProcessedEvent event) {
    String eventKey = buildEventKey(objectName);
    emitterService.sendEventAndComplete(eventKey, "file-process", event);
  }

  private String buildEventKey(String objectName) {
    return "file-process-" + objectName;
  }
}
