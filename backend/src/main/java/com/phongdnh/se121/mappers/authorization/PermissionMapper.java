package com.phongdnh.se121.mappers.authorization;

import com.phongdnh.se121.dtos.authorization.PermissionRequest;
import com.phongdnh.se121.dtos.authorization.PermissionResponse;
import com.phongdnh.se121.entities.authorization.Permission;
import com.phongdnh.se121.mappers.GenericMapper;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface PermissionMapper
    extends GenericMapper<Permission, PermissionRequest, PermissionResponse> {}
