package com.phongdnh.se121.services.authorization;

import com.phongdnh.se121.dtos.authorization.RoleRequestDTO;
import com.phongdnh.se121.dtos.authorization.RoleResponseDTO;
import com.phongdnh.se121.entities.authorization.Role;
import com.phongdnh.se121.services.CrudService;

public interface IRoleSerivce extends CrudService<Role, Long, RoleRequestDTO, RoleResponseDTO> {}
