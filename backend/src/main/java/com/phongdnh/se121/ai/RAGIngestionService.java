package com.phongdnh.se121.ai;

import com.phongdnh.se121.entities.property.Property;

public interface RAGIngestionService {
  void ingestProperty(Property property);

  void updatePropertyIngestion(Property property);

  void deletePropertyIngestion(Long propertyId);

  String createStrategyDocument(Property property);
}
