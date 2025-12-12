package com.phongdnh.se121.ai;

import static org.springframework.ai.chat.memory.ChatMemory.CONVERSATION_ID;

import com.phongdnh.se121.constants.AIConstant;
import java.util.List;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.ai.rag.advisor.RetrievalAugmentationAdvisor;
import org.springframework.ai.rag.generation.augmentation.ContextualQueryAugmenter;
import org.springframework.ai.rag.preretrieval.query.transformation.CompressionQueryTransformer;
import org.springframework.ai.rag.retrieval.search.VectorStoreDocumentRetriever;
import org.springframework.ai.template.st.StTemplateRenderer;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

@Service
public class RAGOrchestratorServiceImpl implements RAGOrchestratorService {

  private final ChatClient chatClient;
  private final RetrievalAugmentationAdvisor retrievalAugmentationAdvisor;
  private final MessageChatMemoryAdvisor messageChatMemoryAdvisor;
  private final VectorStore vectorStore;

  private static final PromptTemplate COMPRESSION_PROMPT_TEMPLATE =
      new PromptTemplate(
          """
          Given the following conversation history and a follow-up query, your task is to synthesize
          a concise, standalone query that incorporates the context from the history.
          Ensure the standalone query is clear, specific, and maintains the user's intent.
          Return the standalone query as the response only without any other irrelevant content.
          Conversation history:
          {history}

          Follow-up query:
          {query}

          Standalone query:
          """);

  public RAGOrchestratorServiceImpl(
      VectorStore vectorStore,
      ChatMemory chatMemory,
      TextNormalizeService textNormalizeService,
      ChatModel chatModel) {
    this.vectorStore = vectorStore;
    this.messageChatMemoryAdvisor = MessageChatMemoryAdvisor.builder(chatMemory).build();
    PromptTemplate customPromtTemplate =
        PromptTemplate.builder()
            .renderer(
                StTemplateRenderer.builder()
                    .startDelimiterToken('<')
                    .endDelimiterToken('>')
                    .build())
            .template(AIConstant.QUERY_PROMPT)
            .build();
    this.retrievalAugmentationAdvisor =
        RetrievalAugmentationAdvisor.builder()
            .queryTransformers(
                CompressionQueryTransformer.builder()
                    .chatClientBuilder(ChatClient.builder(chatModel))
                    .promptTemplate(COMPRESSION_PROMPT_TEMPLATE)
                    .build())
            .documentRetriever(
                VectorStoreDocumentRetriever.builder().vectorStore(vectorStore).build())
            .queryAugmenter(
                ContextualQueryAugmenter.builder()
                    .allowEmptyContext(true)
                    .promptTemplate(customPromtTemplate)
                    .build())
            .build();
    this.chatClient = ChatClient.builder(chatModel).build();
  }

  @Override
  public String query(String userQuery, String conversationId) {
    return input(userQuery, conversationId).call().content();
  }

  public ChatClient.ChatClientRequestSpec input(String userInput, String conversationId) {
    return chatClient
        .prompt()
        .advisors(messageChatMemoryAdvisor, retrievalAugmentationAdvisor)
        .advisors(spec -> spec.param(CONVERSATION_ID, conversationId))
        .user(userInput);
  }

  public ChatResponse call(String userInput, String conversationId) {
    return input(userInput, conversationId).call().chatResponse();
  }

  public Flux<String> stream(String userInput, String conversationId) {
    return input(userInput, conversationId).stream().content();
  }

  @Override
  public List<Long> findSimilar(String query, int topK) {
    return vectorStore
        .similaritySearch(SearchRequest.builder().topK(topK).query(query).build())
        .stream()
        .map(
            doc -> {
              Object idObj = doc.getMetadata().get("propertyId");
              return ((Number) idObj).longValue();
            })
        .toList();
  }
}
