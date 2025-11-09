package com.phongdnh.se121.ai;

import static org.springframework.ai.chat.memory.ChatMemory.CONVERSATION_ID;

import com.phongdnh.se121.constants.AIConstant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.client.advisor.vectorstore.QuestionAnswerAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

@Service
public class RAGOrchestratorServiceImpl implements RAGOrchestratorService {

  private final ChatClient chatClient;
  private final TextNormalizeService textNormalizeService;
  private final VectorStore vectorStore;

  public RAGOrchestratorServiceImpl(
      VectorStore vectorStore,
      ChatMemory chatMemory,
      ChatClient.Builder chatClientBuilder,
      TextNormalizeService textNormalizeService) {
    this.chatClient =
        chatClientBuilder
            .defaultAdvisors(MessageChatMemoryAdvisor.builder(chatMemory).build())
            .build();
    this.textNormalizeService = textNormalizeService;
    this.vectorStore = vectorStore;
  }

  @Override
  public String query(String userQuery, String conversationId) {
    return input(userQuery, conversationId).call().content();
  }

  public ChatClient.ChatClientRequestSpec input(String userInput, String conversationId) {
    Map<String, Object> extracted = textNormalizeService.extractUserQueryMetadata(userInput);
    List<String> filterExpressions = new ArrayList<>();
    extracted.forEach(
        (k, v) -> {
          if (k.contains("max")) {
            String keyWithoutMax = k.replace("max", "");
            if (keyWithoutMax.isEmpty()) {
              return;
            }
            keyWithoutMax = keyWithoutMax.substring(0, 1).toLowerCase();
            filterExpressions.add(keyWithoutMax + " <= " + v);
            return;
          }
          if (k.contains("min")) {
            String keyWithoutMin = k.replace("min", "");
            if (keyWithoutMin.isEmpty()) {
              return;
            }
            keyWithoutMin = keyWithoutMin.substring(0, 1).toLowerCase();
            filterExpressions.add(keyWithoutMin + " >= " + v);
            return;
          }
          if (v instanceof Number) {
            filterExpressions.add(k + " == " + v);
            return;
          }
          filterExpressions.add(k + " == '" + v + "'");
        });
    String finalFilter = String.join(" AND ", filterExpressions);

    SearchRequest searchRequest =
        SearchRequest.builder().query(userInput).topK(5).filterExpression(finalFilter).build();

    return chatClient
        .prompt(AIConstant.QUERY_PROMPT)
        .advisors(spec -> spec.param(CONVERSATION_ID, conversationId))
        .advisors(QuestionAnswerAdvisor.builder(vectorStore).searchRequest(searchRequest).build())
        .user(userInput);
  }

  public ChatResponse call(String userInput, String conversationId) {
    return input(userInput, conversationId).call().chatResponse();
  }

  public Flux<String> stream(String userInput, String conversationId) {
    return input(userInput, conversationId).stream().content();
  }
}
