package com.phongdnh.se121.services.property;

import com.phongdnh.se121.dtos.property.PropertyResponse;
import java.util.List;

public interface PropertyService {

  List<PropertyResponse> findSimilarProperties(Long id, int limit);

  List<PropertyResponse> findPropertiesWithinRadius(
      double latitude, double longitude, double radiusInKm);
}
