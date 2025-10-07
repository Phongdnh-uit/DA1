package com.phongdnh.se121.services.authorization;

import com.phongdnh.se121.dtos.authorization.RoleRequest;
import com.phongdnh.se121.dtos.authorization.RoleResponse;
import com.phongdnh.se121.entities.authorization.Role;
import com.phongdnh.se121.services.CrudService;

public interface IRoleSerivce extends CrudService<Role, Long, RoleRequest, RoleResponse> {}
