package com.phongdnh.se121.services.general;

import com.phongdnh.se121.events.FileProcessedEvent;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

public interface FileNotificationService {

  SseEmitter subcribe(String objectName);

  void notifyFileProcessed(String objectName, FileProcessedEvent event);
}
