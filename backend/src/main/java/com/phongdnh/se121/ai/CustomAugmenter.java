package com.phongdnh.se121.ai;

import com.phongdnh.se121.constants.AppConstant;
import java.util.List;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.ai.document.Document;
import org.springframework.ai.rag.Query;
import org.springframework.ai.rag.generation.augmentation.ContextualQueryAugmenter;
import org.springframework.ai.rag.generation.augmentation.QueryAugmenter;

public class CustomAugmenter implements QueryAugmenter {

  private final ContextualQueryAugmenter delegate;

  public CustomAugmenter(PromptTemplate promptTemplate) {
    this.delegate =
        ContextualQueryAugmenter.builder()
            .allowEmptyContext(true)
            .promptTemplate(promptTemplate)
            .build();
  }

  @Override
  public Query augment(Query query, List<Document> documents) {
    for (Document doc : documents) {
        System.out.println("Document: " + doc.getText());
      String propertyId = (String) doc.getMetadata().get("propertyId");
      StringBuilder urlBuilder = new StringBuilder(AppConstant.FRONTEND_URL);
      urlBuilder.append("/detail/").append(propertyId);
      doc.getMetadata().put("url", urlBuilder.toString());
    }
    System.out.println("Number of documents: " + documents.size());
    System.out.println("Query before augmentation: " + query.text());
    return delegate.augment(query, documents);
  }
}
