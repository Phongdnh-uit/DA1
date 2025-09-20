package com.phongdnh.se121.controllers.authorization;

import com.phongdnh.se121.controllers.GenericController;
import com.phongdnh.se121.dtos.authorization.RoleRequestDTO;
import com.phongdnh.se121.dtos.authorization.RoleResponseDTO;
import com.phongdnh.se121.entities.authorization.Role;
import com.phongdnh.se121.services.CrudService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/roles")
@RestController
public class RoleController extends GenericController<Role, Long, RoleRequestDTO, RoleResponseDTO> {

  public RoleController(CrudService<Role, Long, RoleRequestDTO, RoleResponseDTO> service) {
    super(service);
  }
}
