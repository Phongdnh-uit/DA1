package com.phongdnh.se121.services.general;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Slf4j
@Service
public class EmitterServiceImpl implements EmitterService {

  // Map: key -> queue các emitter
  private final Map<String, ConcurrentLinkedQueue<SseEmitter>> emitters = new ConcurrentHashMap<>();

  @Override
  public SseEmitter createEmitter(String key, Long timeoutMillis) {
    SseEmitter emitter = new SseEmitter(timeoutMillis);

    // Thêm emitter vào queue
    emitters.computeIfAbsent(key, _ -> new ConcurrentLinkedQueue<>()).add(emitter);
    log.info("Tạo emitter mới với key {}", key);

    // Thiết lập lifecycle callbacks
    emitter.onCompletion(() -> removeSingleEmitter(key, emitter));
    emitter.onTimeout(() -> removeSingleEmitter(key, emitter));
    emitter.onError(_ -> removeSingleEmitter(key, emitter));

    try {
      // Gửi event khởi tạo
      emitter.send(SseEmitter.event().name("INIT").data("Kết nối SSE đã được thiết lập."));
    } catch (IOException e) {
      log.error("Lỗi khi gửi INIT: {}", e.getMessage());
      removeSingleEmitter(key, emitter);
    }

    return emitter;
  }

  @Override
  public void sendEvent(String key, String eventName, Object event) {
    log.info("Gửi sự kiện '{}' tới emitter key={}", eventName, key);
    ConcurrentLinkedQueue<SseEmitter> queue = emitters.get(key);
    if (queue != null) {
      queue.forEach(
          emitter -> {
            try {
              emitter.send(SseEmitter.event().name(eventName).data(event));
            } catch (IOException e) {
              log.warn("Emitter lỗi khi gửi event {} key={}: {}", eventName, key, e.getMessage());
              removeSingleEmitter(key, emitter);
            }
          });
    }
  }

  @Override
  public void sendEventAndComplete(String key, String eventName, Object event) {
    ConcurrentLinkedQueue<SseEmitter> queue = emitters.get(key);
    if (queue != null) {
      queue.forEach(
          emitter -> {
            try {
              emitter.send(SseEmitter.event().name(eventName).data(event));
            } catch (IOException e) {
              log.warn("Emitter lỗi khi gửi event {} key={}: {}", eventName, key, e.getMessage());
            } finally {
              emitter.complete();
            }
          });
      emitters.remove(key);
      log.info("Hoàn thành tất cả emitter key={} sau khi gửi event '{}'", key, eventName);
    }
  }

  @Override
  public void removeEmitter(String key) {
    ConcurrentLinkedQueue<SseEmitter> queue = emitters.remove(key);
    if (queue != null) {
      queue.forEach(SseEmitter::complete);
      log.info("Xóa tất cả emitter key={}", key);
    }
  }

  private void removeSingleEmitter(String key, SseEmitter emitter) {
    ConcurrentLinkedQueue<SseEmitter> queue = emitters.get(key);
    if (queue != null) {
      queue.remove(emitter);
      if (queue.isEmpty()) {
        emitters.remove(key);
      }
      log.info("Xóa emitter riêng lẻ key={}", key);
    }
  }
}
