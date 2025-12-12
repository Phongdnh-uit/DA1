package com.phongdnh.se121.controllers.ai;

import com.phongdnh.se121.ai.RAGOrchestratorService;
import com.phongdnh.se121.dtos.ai.AiChatRequest;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

@Tag(name = "AI")
@RequestMapping("/ai/chat")
@RequiredArgsConstructor
@RestController
public class AiChatController {
  private final RAGOrchestratorService ragOrchestratorService;

  @PostMapping("/query")
  public ResponseEntity<String> query(@Valid @RequestBody AiChatRequest request) {
    return ResponseEntity.ok(
        ragOrchestratorService.query(request.getMessage(), request.getConversationId()));
  }

  @PostMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
  public Flux<String> stream(@Valid @RequestBody AiChatRequest request) {
    return ragOrchestratorService.stream(request.getMessage(), request.getConversationId())
        .onErrorResume(e -> Flux.just("Error: " + e.getMessage()));
  }
}
