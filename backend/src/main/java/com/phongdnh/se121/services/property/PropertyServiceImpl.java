package com.phongdnh.se121.services.property;

import com.phongdnh.se121.ai.RAGOrchestratorService;
import com.phongdnh.se121.dtos.PageResponse;
import com.phongdnh.se121.dtos.property.PropertyResponse;
import com.phongdnh.se121.entities.property.Property;
import com.phongdnh.se121.exceptions.errors.ApiException;
import com.phongdnh.se121.exceptions.errors.ErrorCode;
import com.phongdnh.se121.hooks.property.PropertyHook;
import com.phongdnh.se121.mappers.property.PropertyMapper;
import com.phongdnh.se121.repositories.property.PropertyRepository;
import com.phongdnh.se121.utils.StringUtil;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class PropertyServiceImpl implements PropertyService {
  private final PropertyRepository propertyRepository;
  private final PropertyMapper propertyMapper;
  private final PropertyHook propertyHook;
  private final RAGOrchestratorService ragOrchestratorService;
  private final GeometryFactory geometryFactory;

  @Override
  public List<PropertyResponse> findSimilarProperties(Long id, int limit) {
    Property property =
        propertyRepository
            .findById(id)
            .orElseThrow(() -> new ApiException(ErrorCode.RESOURCE_NOT_FOUND));
    String query = createQueryStategy(property);
    List<Long> similarPropertyIds =
        ragOrchestratorService.findSimilar(query, limit).stream()
            .filter(similarId -> !similarId.equals(id))
            .toList();
    List<Property> similarProperties =
        propertyRepository.findAll((root, _, _) -> root.get("id").in(similarPropertyIds));
    var response = similarProperties.stream().map(propertyMapper::entityToResponse).toList();
    var temp = new PageResponse<PropertyResponse>();
    temp.setContent(response);
    propertyHook.enrichFindAll(temp);
    return temp.getContent();
  }

  public String createQueryStategy(Property property) {
    StringBuilder sb =
        new StringBuilder("Tìm bất động sản có các đặc điểm tương tự với bất động sản sau đây:\n");

    sb.append("[BẤT ĐỘNG SẢN]").append("\n");
    sb.append("ID: ").append(property.getId()).append("\n");
    sb.append("Tiêu đề: ").append(StringUtil.safe(property.getTitle())).append("\n");
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

  @Override
  public List<PropertyResponse> findPropertiesWithinRadius(
      double latitude, double longitude, double radiusInMeters) {
    Point point = geometryFactory.createPoint(new Coordinate(longitude, latitude));
    List<Property> properties = propertyRepository.findWithinDistance(point, radiusInMeters);

    var response = properties.stream().map(propertyMapper::entityToResponse).toList();
    var temp = new PageResponse<PropertyResponse>();
    temp.setContent(response);
    propertyHook.enrichFindAll(temp);
    return temp.getContent();
  }
}
