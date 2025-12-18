package com.phongdnh.se121.controllers.general;

import com.phongdnh.se121.services.general.FileNotificationService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Tag(name = "SSE - Server Sent Events")
@RequiredArgsConstructor
@RestController
public class SseController {
  private final FileNotificationService fileNotificationService;

  @GetMapping("/sse/files/notifications/{key}/subscribe")
  public SseEmitter subscribeToFileNotifications(@PathVariable("key") String key) {
    return fileNotificationService.subcribe(key);
  }
}
