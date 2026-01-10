package com.phongdnh.se121.controllers.authorization;

import com.phongdnh.se121.controllers.GenericController;
import com.phongdnh.se121.dtos.authorization.RoleRequest;
import com.phongdnh.se121.dtos.authorization.RoleResponse;
import com.phongdnh.se121.entities.authorization.Role;
import com.phongdnh.se121.services.CrudService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Role")
@RequestMapping("/roles")
@RestController
public class RoleController extends GenericController<Role, Long, RoleRequest, RoleResponse> {

  public RoleController(CrudService<Role, Long, RoleRequest, RoleResponse> service) {
    super(service);
  }
}
