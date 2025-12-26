package com.phongdnh.se121;

import org.junit.jupiter.api.Test;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

@SpringBootTest(
    properties = {
      "spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE",
      "spring.datasource.driverClassName=org.h2.Driver",
      "spring.datasource.username=sa",
      "spring.datasource.password=",
      "spring.jpa.hibernate.ddl-auto=create-drop",
      "spring.jpa.show-sql=true",
      "spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect",
      "jwt.secret=xin_chao_ban!_day_la_du_an_uit_land_cho_do_an_1_cua_minh!_xin_cam_on_ban_da_doc_du_an_nay",
      "jwt.refresh-token.expiration=172800",
      "jwt.access-token.expiration=18000",
      "spring.flyway.enabled=false",
      "spring.ai.vectorstore.enabled=false",
      "spring.ai.chat.enabled=false",
      "spring.ai.vectorstore.milvus.enabled=false",
      "spring.ai.ollama.enabled=false",
      "spring.mail.host=localhost",
      "app.bootstrap.admin.phone=0123456789",
      "app.bootstrap.admin.password=password",
      "app.bootstrap.admin.email=test@gmail.com"
    })
@EnableAutoConfiguration(
    exclude = {
      org.springframework.ai.model.ollama.autoconfigure.OllamaChatAutoConfiguration.class,
      org.springframework.ai.model.ollama.autoconfigure.OllamaEmbeddingAutoConfiguration.class,
      org.springframework.ai.vectorstore.milvus.autoconfigure.MilvusVectorStoreAutoConfiguration
          .class
    })
class Se121ApplicationTests {

  @MockitoBean private VectorStore vectorStore;

  @MockitoBean private ChatModel chatModel;

  @MockitoBean private ClientRegistrationRepository clientRegistrationRepository;

  @Test
  void contextLoads() {}
}
