package com.phongdnh.se121.controllers.authorization;

import com.phongdnh.se121.controllers.GenericController;
import com.phongdnh.se121.dtos.authorization.PermissionRequestDTO;
import com.phongdnh.se121.dtos.authorization.PermissionResponseDTO;
import com.phongdnh.se121.entities.authorization.Permission;
import com.phongdnh.se121.services.CrudService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/permissions")
@RestController
public class PermissionController
    extends GenericController<Permission, Long, PermissionRequestDTO, PermissionResponseDTO> {

  public PermissionController(
      CrudService<Permission, Long, PermissionRequestDTO, PermissionResponseDTO> service) {
    super(service);
  }
}
