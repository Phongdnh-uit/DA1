package com.phongdnh.se121.controllers.property;

import com.phongdnh.se121.controllers.GenericController;
import com.phongdnh.se121.dtos.property.ProvinceRequest;
import com.phongdnh.se121.dtos.property.ProvinceResponse;
import com.phongdnh.se121.entities.property.Province;
import com.phongdnh.se121.services.CrudService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Province")
@RequestMapping("/provinces")
@RestController
public class ProvinceController
    extends GenericController<Province, Long, ProvinceRequest, ProvinceResponse> {

  public ProvinceController(
      CrudService<Province, Long, ProvinceRequest, ProvinceResponse> service) {
    super(service);
  }
}
