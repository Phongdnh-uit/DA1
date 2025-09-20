package com.phongdnh.se121.mappers.authorization;

import com.phongdnh.se121.dtos.authorization.RoleRequestDTO;
import com.phongdnh.se121.dtos.authorization.RoleResponseDTO;
import com.phongdnh.se121.entities.authorization.Role;
import com.phongdnh.se121.mappers.GenericMapper;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface RoleMapper extends GenericMapper<Role, RoleRequestDTO, RoleResponseDTO> {}
