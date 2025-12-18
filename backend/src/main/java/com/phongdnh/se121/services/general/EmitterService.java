package com.phongdnh.se121.services.general;

import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

public interface EmitterService {
  SseEmitter createEmitter(String key, Long timeout);

  void sendEvent(String key, String eventName, Object event);

  void sendEventAndComplete(String key, String eventName, Object event);

  void removeEmitter(String key);
}
