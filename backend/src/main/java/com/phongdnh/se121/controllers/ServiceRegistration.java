package com.phongdnh.se121.controllers;

import com.phongdnh.se121.dtos.authorization.PermissionRequestDTO;
import com.phongdnh.se121.dtos.authorization.PermissionResponseDTO;
import com.phongdnh.se121.dtos.authorization.RoleRequestDTO;
import com.phongdnh.se121.dtos.authorization.RoleResponseDTO;
import com.phongdnh.se121.entities.authorization.Permission;
import com.phongdnh.se121.entities.authorization.Role;
import com.phongdnh.se121.mappers.authorization.PermissionMapper;
import com.phongdnh.se121.mappers.authorization.RoleMapper;
import com.phongdnh.se121.policies.authorizations.PermissionPolicy;
import com.phongdnh.se121.repositories.authorization.PermissionRepository;
import com.phongdnh.se121.repositories.authorization.RoleRepository;
import com.phongdnh.se121.services.CrudService;
import com.phongdnh.se121.services.GenericService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@RequiredArgsConstructor
@Configuration
public class ServiceRegistration {
  private final ApplicationContext context;

  @Bean
  CrudService<Permission, Long, PermissionRequestDTO, PermissionResponseDTO> permissionService() {
    return new GenericService<Permission, Long, PermissionRequestDTO, PermissionResponseDTO>(
        context.getBean(PermissionRepository.class),
        context.getBean(PermissionMapper.class),
        context.getBean(PermissionPolicy.class));
  }

  @Bean
  CrudService<Role, Long, RoleRequestDTO, RoleResponseDTO> roleService() {
    return new GenericService<Role, Long, RoleRequestDTO, RoleResponseDTO>(
        context.getBean(RoleRepository.class), context.getBean(RoleMapper.class), null);
  }
}
