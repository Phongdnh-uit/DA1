package com.phongdnh.se121.ai;

import com.phongdnh.se121.entities.property.Property;
import com.phongdnh.se121.utils.StringUtil;
import java.util.LinkedHashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.document.Document;
import org.springframework.ai.transformer.splitter.TextSplitter;
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

  @Async
  @Override
  public void deletePropertyIngestion(Long propertyId) {
    log.info("Deleting ingested vectors for property ID: {}", propertyId);

    try {
      FilterExpressionBuilder builder = new FilterExpressionBuilder();

      Filter.Expression filterExpression =
          builder.eq("propertyId", propertyId.doubleValue()).build();

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

  @Override
  public String createStrategyDocument(Property property) {
    StringBuilder sb = new StringBuilder();

    sb.append("[BẤT ĐỘNG SẢN]").append("\n");
    sb.append("ID: ").append(property.getId()).append("\n");
    sb.append("Tiêu đề: ")
        .append(StringUtil.safe(textNormalizeService.normalizeTitle(property.getTitle())))
        .append("\n");
    sb.append("Mục đích: ").append(StringUtil.safe(property.getPurpose().getName())).append("\n");
    sb.append("Loại: ").append(StringUtil.safe(property.getType().getName())).append("\n");
    sb.append("Thành phố: ")
        .append(StringUtil.safe(property.getWard().getProvince().getName()))
        .append("\n");
    sb.append("Phường/Xã: ").append(StringUtil.safe(property.getWard().getName())).append("\n");

    if (property.getPrice() != null)
      sb.append("Giá: ").append(StringUtil.formatPrice(property.getPrice())).append("\n");
    if (property.getLandArea() != null)
      sb.append("Diện tích đất: ")
          .append(StringUtil.formatArea(property.getLandArea()))
          .append("\n");
    if (property.getFloorArea() != null)
      sb.append("Diện tích sàn: ")
          .append(StringUtil.formatArea(property.getFloorArea()))
          .append("\n");
    if (property.getFloors() != null)
      sb.append("Số tầng: ").append(property.getFloors()).append("\n");
    if (property.getBedrooms() != null)
      sb.append("Số phòng ngủ: ").append(property.getBedrooms()).append("\n");
    if (property.getBathrooms() != null)
      sb.append("Số phòng tắm: ").append(property.getBathrooms()).append("\n");
    if (property.getEntranceRoadWidth() != null)
      sb.append("Đường vào rộng: ")
          .append(property.getEntranceRoadWidth())
          .append(" m")
          .append("\n");
    if (!StringUtil.safe(property.getLineAddress()).isEmpty())
      sb.append("Địa chỉ: ").append(property.getLineAddress()).append("\n");

    return sb.toString().trim();
  }

  private void putIfNotNull(Map<String, Object> map, String key, Object value) {
    if (value != null) map.put(key, value);
  }
}
