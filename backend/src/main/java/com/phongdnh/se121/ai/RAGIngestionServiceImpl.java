package com.phongdnh.se121.ai;

import com.phongdnh.se121.entities.property.Property;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.document.Document;
import org.springframework.ai.transformer.splitter.TextSplitter;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.ai.vectorstore.filter.Filter;
import org.springframework.ai.vectorstore.filter.FilterExpressionBuilder;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class RAGIngestionServiceImpl implements RAGIngestionService {

  private final VectorStore vectorStore;
  private final TextSplitter textSplitter;

  @Async
  @Override
  public void ingestProperty(Property property) {
    log.info("Ingesting property with ID: {}", property.getId());
    String documentToEmbed = createStrategyDocument(property);
    Map<String, Object> metadata = new HashMap<>();
    metadata.put("propertyId", property.getId());
    Document document = Document.builder().text(documentToEmbed).metadata(metadata).build();
    var chunks = textSplitter.split(document);
    vectorStore.add(chunks);
    log.info("Ingestion completed for property with ID: {}", property.getId());
  }

  @Override
  public void deletePropertyIngestion(Long propertyId) {
    log.info("Deleting ingested vectors for property ID: {}", propertyId);

    try {
      FilterExpressionBuilder builder = new FilterExpressionBuilder();

      Filter.Expression filterExpression = builder.eq("propertyId", propertyId.toString()).build();

      vectorStore.delete(filterExpression);

      log.info("Deleted ingested vectors for property ID: {}", propertyId);

    } catch (Exception e) {
      log.error("Error deleting vectors for property ID: {}", propertyId, e);
    }
  }

  @Async
  @Override
  public void updatePropertyIngestion(Property property) {
    deletePropertyIngestion(property.getId());
    ingestProperty(property);
  }

  @Override
  public List<Document> findSimilar(List<Property> properties, int topK) {
    if (properties.isEmpty()) {
      return List.of();
    }
    List<String> queries = properties.stream().map(this::createStrategyDocument).toList();
    List<Document> combinedResults =
        queries.parallelStream()
            .<Document>mapMulti(
                (query, consumer) -> {
                  SearchRequest request = SearchRequest.builder().query(query).topK(topK).build();
                  vectorStore.similaritySearch(request).forEach(consumer);
                })
            .toList();

    Map<String, Document> uniqueResults = new HashMap<>();
    Map<String, Double> relevanceScores = new HashMap<>();
    Map<String, Integer> frequency = new HashMap<>();

    for (Document doc : combinedResults) {
      String docId = doc.getMetadata().get("propertyId").toString();
      double distance = (double) doc.getMetadata().getOrDefault("distance", 1.0);
      double similarity = 1.0 - distance;
      if (!uniqueResults.containsKey(docId)) {
        uniqueResults.put(docId, doc);
        relevanceScores.put(docId, similarity);
        frequency.put(docId, 1);
      } else {
        relevanceScores.merge(docId, similarity, Double::max);
        frequency.merge(docId, 1, Integer::sum);
      }
    }

    List<Document> rankedResults =
        uniqueResults.values().stream()
            .sorted(
                (doc1, doc2) -> {
                  String docId1 = doc1.getMetadata().get("propertyId").toString();
                  String docId2 = doc2.getMetadata().get("propertyId").toString();

                  int freqCompare = frequency.get(docId2).compareTo(frequency.get(docId1));
                  if (freqCompare != 0) {
                    return freqCompare;
                  } else {
                    return relevanceScores.get(docId2).compareTo(relevanceScores.get(docId1));
                  }
                })
            .toList();
    List<String> inputPropertyIds = properties.stream().map(p -> p.getId().toString()).toList();
    List<Document> finalResults =
        rankedResults.stream()
            .filter(
                doc -> !inputPropertyIds.contains(doc.getMetadata().get("propertyId").toString()))
            .limit(topK)
            .toList();
    return finalResults.stream().limit(topK).toList();
  }

  String createStrategyDocument(Property property) {
    StringBuilder documentBuilder = new StringBuilder();
    documentBuilder.append("Tiêu đề: ").append(property.getTitle()).append("\n");
    documentBuilder.append("Mục đích: ").append(property.getPurpose().getName()).append("\n");
    documentBuilder.append("Loại: ").append(property.getType().getName()).append("\n");
    documentBuilder.append("Giá: ").append(property.getPrice()).append(" VND\n");
    documentBuilder
        .append("Tỉnh/Thành phố: ")
        .append(property.getWard().getProvince().getName())
        .append("\n");
    documentBuilder.append("Xã/Phường: ").append(property.getWard().getName()).append("\n");
    if (property.getLineAddress() != null) {
      documentBuilder.append("Địa chỉ: ").append(property.getLineAddress()).append("\n");
    }
    if (property.getLandArea() != null) {

      documentBuilder.append("Diện tích đất: ").append(property.getLandArea()).append(" m2\n");
    }
    if (property.getFloorArea() != null) {

      documentBuilder.append("Diện tích sàn: ").append(property.getFloorArea()).append(" m2\n");
    }
    if (property.getFloors() != null) {

      documentBuilder.append("Số tầng: ").append(property.getFloors()).append("\n");
    }
    if (property.getFloorNumber() != null) {

      documentBuilder.append("Tầng số: ").append(property.getFloorNumber()).append("\n");
    }
    if (property.getBedrooms() != null) {

      documentBuilder.append("Số phòng ngủ: ").append(property.getBedrooms()).append("\n");
    }
    if (property.getBathrooms() != null) {
      documentBuilder.append("Số phòng tắm: ").append(property.getBathrooms()).append("\n");
    }
    if (property.getEntranceRoadWidth() != null) {

      documentBuilder.append("Số phòng tắm: ").append(property.getBathrooms()).append("\n");
    }
    if (property.getEntranceRoadWidth() != null) {
      documentBuilder
          .append("Chiều rộng đường vào: ")
          .append(property.getEntranceRoadWidth())
          .append(" m\n");
    }
    return documentBuilder.toString();
  }
}
