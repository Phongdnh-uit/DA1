package com.phongdnh.se121.controllers;

import com.phongdnh.se121.dtos.authentication.UserRequest;
import com.phongdnh.se121.dtos.authentication.UserResponse;
import com.phongdnh.se121.dtos.authorization.PermissionRequest;
import com.phongdnh.se121.dtos.authorization.PermissionResponse;
import com.phongdnh.se121.entities.authentication.User;
import com.phongdnh.se121.entities.authorization.Permission;
import com.phongdnh.se121.hooks.authentication.UserHook;
import com.phongdnh.se121.hooks.authorizations.PermissionHook;
import com.phongdnh.se121.mappers.authentication.UserMapper;
import com.phongdnh.se121.mappers.authorization.PermissionMapper;
import com.phongdnh.se121.repositories.authentication.UserRepository;
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
  CrudService<Permission, Long, PermissionRequest, PermissionResponse> permissionService() {
    return new GenericService<Permission, Long, PermissionRequest, PermissionResponse>(
        context.getBean(PermissionRepository.class),
        context.getBean(PermissionMapper.class),
        context.getBean(PermissionHook.class));
  }

  @Bean
  CrudService<User, Long, UserRequest, UserResponse> userService() {
    return new GenericService<User, Long, UserRequest, UserResponse>(
        context.getBean(UserRepository.class),
        context.getBean(UserMapper.class),
        context.getBean(UserHook.class));
  }
}
