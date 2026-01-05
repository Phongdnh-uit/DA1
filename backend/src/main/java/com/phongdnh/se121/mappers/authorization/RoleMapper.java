package com.phongdnh.se121.mappers.authorization;

import com.phongdnh.se121.dtos.authorization.RoleRequest;
import com.phongdnh.se121.dtos.authorization.RoleResponse;
import com.phongdnh.se121.entities.authorization.Role;
import com.phongdnh.se121.mappers.GenericMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface RoleMapper extends GenericMapper<Role, RoleRequest, RoleResponse> {

  @Mapping(
      target = "permissionIds",
      expression =
          "java(entity.getPermissions().stream().map(com.phongdnh.se121.entities.authorization.Permission::getId).collect(java.util.stream.Collectors.toSet()))")
  @Override
  RoleResponse entityToResponse(Role entity);
}
