package com.phongdnh.se121.controllers;

import com.phongdnh.se121.dtos.authorization.PermissionRequestDTO;
import com.phongdnh.se121.dtos.authorization.PermissionResponseDTO;
import com.phongdnh.se121.entities.authorization.Permission;
import com.phongdnh.se121.hooks.authorizations.PermissionHook;
import com.phongdnh.se121.mappers.authorization.PermissionMapper;
import com.phongdnh.se121.repositories.authorization.PermissionRepository;
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
        context.getBean(PermissionHook.class));
  }
}
