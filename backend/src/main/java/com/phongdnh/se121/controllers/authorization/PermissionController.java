package com.phongdnh.se121.controllers.authorization;

import com.phongdnh.se121.controllers.GenericController;
import com.phongdnh.se121.dtos.authorization.PermissionRequest;
import com.phongdnh.se121.dtos.authorization.PermissionResponse;
import com.phongdnh.se121.entities.authorization.Permission;
import com.phongdnh.se121.services.CrudService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Permission")
@RequestMapping("/permissions")
@RestController
public class PermissionController
    extends GenericController<Permission, Long, PermissionRequest, PermissionResponse> {

  public PermissionController(
      CrudService<Permission, Long, PermissionRequest, PermissionResponse> service) {
    super(service);
  }
}
