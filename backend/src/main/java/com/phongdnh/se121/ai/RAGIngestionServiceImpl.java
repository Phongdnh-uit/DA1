package com.phongdnh.se121.ai;

import com.phongdnh.se121.entities.property.Property;
import com.phongdnh.se121.utils.StringUtil;
import java.util.HashMap;
import java.util.LinkedHashMap;
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
  private final TextNormalizeService textNormalizeService;

  @Async
  @Override
  public void ingestProperty(Property property) {
    log.info("Ingesting property with ID: {}", property.getId());
    Map<String, Object> metadata = createPropertyPayload(property);
    String documentToEmbed = createStrategyDocument(property);
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

  private Map<String, Object> createPropertyPayload(Property property) {
    Map<String, Object> payload = new LinkedHashMap<>();
    payload.put("propertyId", property.getId());
    payload.put("city", StringUtil.safe(property.getWard().getProvince().getName()));
    payload.put("ward", StringUtil.safe(property.getWard().getName()));
    payload.put("purpose", StringUtil.safe(property.getPurpose().getName()));
    payload.put("type", StringUtil.safe(property.getType().getName()));

    putIfNotNull(payload, "price", property.getPrice().doubleValue());

    if (property.getLandArea() != null)
      putIfNotNull(payload, "landArea", property.getLandArea().doubleValue());
    if (property.getFloorArea() != null)
      putIfNotNull(payload, "floorArea", property.getFloorArea().doubleValue());
    putIfNotNull(payload, "bedrooms", property.getBedrooms());
    putIfNotNull(payload, "bathrooms", property.getBathrooms());
    putIfNotNull(payload, "floors", property.getFloors());
    putIfNotNull(payload, "entranceRoadWidth", property.getEntranceRoadWidth());

    return payload;
  }

  private String createStrategyDocument(Property property) {
    String title = StringUtil.safe(textNormalizeService.normalizeTitle(property.getTitle()));
    String purpose = StringUtil.safe(property.getPurpose().getName());
    String type = StringUtil.safe(property.getType().getName());
    String city = StringUtil.safe(property.getWard().getProvince().getName());
    String ward = StringUtil.safe(property.getWard().getName());
    String price = StringUtil.formatPrice(property.getPrice());
    String landArea = StringUtil.formatArea(property.getLandArea());
    String floorArea = StringUtil.formatArea(property.getFloorArea());
    String floors = StringUtil.safeNumber(property.getFloors());
    String bedrooms = StringUtil.safeNumber(property.getBedrooms());
    String bathrooms = StringUtil.safeNumber(property.getBathrooms());
    String width = StringUtil.formatWidth(property.getEntranceRoadWidth());
    String address = StringUtil.safe(property.getLineAddress());

    StringBuilder sb = new StringBuilder();

    sb.append(title).append(". ");
    sb.append(
        String.format(
            "%s %s tại %s, %s. ", StringUtil.capitalize(type), purpose.toLowerCase(), ward, city));

    if (price != null) sb.append("Giá: ").append(price).append(". ");
    if (landArea != null) sb.append("Diện tích đất: ").append(landArea).append(". ");
    if (floorArea != null) sb.append("Diện tích sàn: ").append(floorArea).append(". ");
    if (floors != null) sb.append("Số tầng: ").append(floors).append(". ");
    if (bedrooms != null) sb.append("Phòng ngủ: ").append(bedrooms).append(". ");
    if (bathrooms != null) sb.append("Phòng tắm: ").append(bathrooms).append(". ");
    if (width != null) sb.append("Đường vào rộng: ").append(width).append(". ");
    if (!address.isEmpty()) sb.append("Địa chỉ: ").append(address).append(". ");

    return sb.toString().trim();
  }

  private void putIfNotNull(Map<String, Object> map, String key, Object value) {
    if (value != null) map.put(key, value);
  }
}
