package com.phongdnh.se121.controllers.property;

import com.phongdnh.se121.controllers.GenericController;
import com.phongdnh.se121.dtos.property.PropertyRequest;
import com.phongdnh.se121.dtos.property.PropertyResponse;
import com.phongdnh.se121.entities.property.Property;
import com.phongdnh.se121.services.CrudService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Property")
@RequestMapping("/properties")
@RestController
public class PropertyController
    extends GenericController<Property, Long, PropertyRequest, PropertyResponse> {

  public PropertyController(
      CrudService<Property, Long, PropertyRequest, PropertyResponse> service) {
    super(service);
  }
}
