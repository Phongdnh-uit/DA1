package com.phongdnh.se121.controllers.property;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.phongdnh.se121.controllers.GenericController;
import com.phongdnh.se121.dtos.property.PropertyTypeRequest;
import com.phongdnh.se121.dtos.property.PropertyTypeResponse;
import com.phongdnh.se121.entities.property.PropertyType;
import com.phongdnh.se121.services.CrudService;

import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "PropertyType")
@RequestMapping("/property-types")
@RestController
public class PropertyTypeController
    extends GenericController<PropertyType, Long, PropertyTypeRequest, PropertyTypeResponse> {

  public PropertyTypeController(
      CrudService<PropertyType, Long, PropertyTypeRequest, PropertyTypeResponse> service) {
    super(service);
  }
}
