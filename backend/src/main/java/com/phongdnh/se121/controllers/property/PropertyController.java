package com.phongdnh.se121.controllers.property;

import com.phongdnh.se121.controllers.GenericController;
import com.phongdnh.se121.dtos.ApiResponse;
import com.phongdnh.se121.dtos.property.PropertyRequest;
import com.phongdnh.se121.dtos.property.PropertyResponse;
import com.phongdnh.se121.entities.property.Property;
import com.phongdnh.se121.services.CrudService;
import com.phongdnh.se121.services.property.PropertyService;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Property")
@RequestMapping("/properties")
@RestController
public class PropertyController
    extends GenericController<Property, Long, PropertyRequest, PropertyResponse> {

  private final PropertyService propertyService;

  public PropertyController(
      CrudService<Property, Long, PropertyRequest, PropertyResponse> service,
      PropertyService propertyService) {
    super(service);
    this.propertyService = propertyService;
  }

  @GetMapping("/similar/{id}")
  public ResponseEntity<ApiResponse<List<PropertyResponse>>> findSimilarProperties(
      @PathVariable("id") Long id,
      @RequestParam(value = "limit", required = false, defaultValue = "5") int limit) {
    return ResponseEntity.ok(ApiResponse.ok(propertyService.findSimilarProperties(id, limit)));
  }

  @GetMapping("/within-radius")
  public ResponseEntity<ApiResponse<List<PropertyResponse>>> findPropertiesWithinRadius(
      @RequestParam("latitude") double latitude,
      @RequestParam("longitude") double longitude,
      @RequestParam("radiusInMeters") double radiusInMeters) {
    return ResponseEntity.ok(
        ApiResponse.ok(
            propertyService.findPropertiesWithinRadius(latitude, longitude, radiusInMeters)));
  }
}
