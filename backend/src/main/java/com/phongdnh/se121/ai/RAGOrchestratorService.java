package com.phongdnh.se121.ai;

import reactor.core.publisher.Flux;

public interface RAGOrchestratorService {
  String query(String userQuery, String conversationId);

  Flux<String> stream(String userInput, String conversationId);
}
