package com.phongdnh.se121.controllers.property;

import com.phongdnh.se121.controllers.GenericController;
import com.phongdnh.se121.dtos.property.DistrictRequest;
import com.phongdnh.se121.dtos.property.DistrictResponse;
import com.phongdnh.se121.entities.property.District;
import com.phongdnh.se121.services.CrudService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "District")
@RequestMapping("/districts")
@RestController
public class DistrictController
    extends GenericController<District, Long, DistrictRequest, DistrictResponse> {

  public DistrictController(
      CrudService<District, Long, DistrictRequest, DistrictResponse> service) {
    super(service);
  }
}
