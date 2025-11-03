package com.phongdnh.se121.ai;

import com.phongdnh.se121.entities.property.Property;
import java.util.List;
import org.springframework.ai.document.Document;

public interface RAGIngestionService {
  void ingestProperty(Property property);

  void updatePropertyIngestion(Property property);

  void deletePropertyIngestion(Long propertyId);

  List<Document> findSimilar(List<Property> properties, int topK);
}
