package com.phongdnh.se121.ai;

import java.util.List;
import reactor.core.publisher.Flux;

public interface RAGOrchestratorService {
  String query(String userQuery, String conversationId);

  Flux<String> stream(String userInput, String conversationId);

  List<Long> findSimilar(String query, int topK);
}
