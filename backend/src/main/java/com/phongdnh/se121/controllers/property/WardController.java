package com.phongdnh.se121.controllers.property;

import com.phongdnh.se121.controllers.GenericController;
import com.phongdnh.se121.dtos.property.WardRequest;
import com.phongdnh.se121.dtos.property.WardResponse;
import com.phongdnh.se121.entities.property.Ward;
import com.phongdnh.se121.services.CrudService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Ward")
@RequestMapping("/wards")
@RestController
public class WardController extends GenericController<Ward, Long, WardRequest, WardResponse> {

  public WardController(CrudService<Ward, Long, WardRequest, WardResponse> service) {
    super(service);
  }
}
