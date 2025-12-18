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
      Long propertyId = ((Double) doc.getMetadata().get("propertyId")).longValue();
      StringBuilder urlBuilder = new StringBuilder(AppConstant.FRONTEND_URL);
      urlBuilder.append("/detail/").append(propertyId);
      StringBuilder textBuilder = new StringBuilder(doc.getText());
      textBuilder.append("\nLiên kết: ").append(urlBuilder);
      Document updatedDoc =
          Document.builder().text(textBuilder.toString()).metadata(doc.getMetadata()).build();
      documents.set(documents.indexOf(doc), updatedDoc);
    }
    Query lastQuery = delegate.augment(query, documents);
    System.out.println("Augmented Query: " + lastQuery.text());
    return lastQuery;
  }
}
