package com.phongdnh.se121;

import io.minio.MinioClient;
import org.junit.jupiter.api.Test;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

@ActiveProfiles("test")
@EnableAutoConfiguration(
    exclude = {
      org.springframework.ai.model.ollama.autoconfigure.OllamaChatAutoConfiguration.class,
      org.springframework.ai.model.ollama.autoconfigure.OllamaEmbeddingAutoConfiguration.class,
      org.springframework.ai.vectorstore.milvus.autoconfigure.MilvusVectorStoreAutoConfiguration
          .class,
      org.springframework.ai.model.google.genai.autoconfigure.chat.GoogleGenAiChatAutoConfiguration
          .class,
      org.springframework.ai.model.google.genai.autoconfigure.embedding
          .GoogleGenAiEmbeddingConnectionAutoConfiguration.class
    })
class Se121ApplicationTests {

  @MockitoBean private VectorStore vectorStore;

  @MockitoBean private ChatModel chatModel;

  @MockitoBean private ClientRegistrationRepository clientRegistrationRepository;

  @MockitoBean private MinioClient minioClient;

  @Test
  void contextLoads() {}
}
