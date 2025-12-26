package com.phongdnh.se121.ai;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.phongdnh.se121.constants.AIConstant;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.stereotype.Service;

@Service
public class TextNormalizeServiceImpl implements TextNormalizeService {

  private final ChatClient chatClient;

  public TextNormalizeServiceImpl(ChatModel chatModel) {
    this.chatClient = ChatClient.builder(chatModel).build();
  }

  @Override
  public String normalizeTitle(String title) {
    ChatResponse response =
        chatClient.prompt(AIConstant.TITLE_NORMALIZE_PROMPT).user(title).call().chatResponse();
    return response.getResult().getOutput().getText().trim();
  }

  @Override
  public Map<String, Object> extractUserQueryMetadata(String userQuery) {
    Map<String, Object> filters = new LinkedHashMap<>();
    ChatResponse response =
        chatClient.prompt(AIConstant.EXTRACT_QUERY_PROMPT).user(userQuery).call().chatResponse();
    String output = response.getResult().getOutput().getText().trim();
    try {
      Map<String, Object> llmFilters =
          new ObjectMapper().readValue(output, new TypeReference<Map<String, Object>>() {});
      llmFilters.forEach(
          (k, v) -> {
            if (v != null && !v.toString().isBlank()) filters.putIfAbsent(k, v);
          });
      return filters;
    } catch (Exception e) {
      throw new RuntimeException("Failed to parse metadata from AI response", e);
    }
  }
}
