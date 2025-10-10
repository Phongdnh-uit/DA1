package com.phongdnh.se121.controllers;

import com.phongdnh.se121.dtos.authentication.UserRequest;
import com.phongdnh.se121.dtos.authentication.UserResponse;
import com.phongdnh.se121.dtos.authorization.PermissionRequest;
import com.phongdnh.se121.dtos.authorization.PermissionResponse;
import com.phongdnh.se121.dtos.property.PropertyRequest;
import com.phongdnh.se121.dtos.property.PropertyResponse;
import com.phongdnh.se121.dtos.property.PropertyTypeRequest;
import com.phongdnh.se121.dtos.property.PropertyTypeResponse;
import com.phongdnh.se121.dtos.property.ProvinceRequest;
import com.phongdnh.se121.dtos.property.ProvinceResponse;
import com.phongdnh.se121.dtos.property.WardRequest;
import com.phongdnh.se121.dtos.property.WardResponse;
import com.phongdnh.se121.entities.authentication.User;
import com.phongdnh.se121.entities.authorization.Permission;
import com.phongdnh.se121.entities.property.Property;
import com.phongdnh.se121.entities.property.PropertyType;
import com.phongdnh.se121.entities.property.Province;
import com.phongdnh.se121.entities.property.Ward;
import com.phongdnh.se121.hooks.GeneralHook;
import com.phongdnh.se121.hooks.authentication.UserHook;
import com.phongdnh.se121.hooks.authorizations.PermissionHook;
import com.phongdnh.se121.hooks.property.PropertyTypeHook;
import com.phongdnh.se121.hooks.property.ProvinceHook;
import com.phongdnh.se121.hooks.property.WardHook;
import com.phongdnh.se121.mappers.authentication.UserMapper;
import com.phongdnh.se121.mappers.authorization.PermissionMapper;
import com.phongdnh.se121.mappers.property.PropertyMapper;
import com.phongdnh.se121.mappers.property.PropertyTypeMapper;
import com.phongdnh.se121.mappers.property.ProvinceMapper;
import com.phongdnh.se121.mappers.property.WardMapper;
import com.phongdnh.se121.repositories.authentication.UserRepository;
import com.phongdnh.se121.repositories.authorization.PermissionRepository;
import com.phongdnh.se121.repositories.property.PropertyRepository;
import com.phongdnh.se121.repositories.property.PropertyTypeRepository;
import com.phongdnh.se121.repositories.property.ProvinceRepository;
import com.phongdnh.se121.repositories.property.WardRepository;
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

  @Bean
  CrudService<Province, Long, ProvinceRequest, ProvinceResponse> provinceService() {
    return new GenericService<Province, Long, ProvinceRequest, ProvinceResponse>(
        context.getBean(ProvinceRepository.class),
        context.getBean(ProvinceMapper.class),
        context.getBean(ProvinceHook.class));
  }

  @Bean
  CrudService<Ward, Long, WardRequest, WardResponse> districtService() {
    return new GenericService<Ward, Long, WardRequest, WardResponse>(
        context.getBean(WardRepository.class),
        context.getBean(WardMapper.class),
        context.getBean(WardHook.class));
  }

  @Bean
  CrudService<PropertyType, Long, PropertyTypeRequest, PropertyTypeResponse> propertyTypeService() {
    return new GenericService<PropertyType, Long, PropertyTypeRequest, PropertyTypeResponse>(
        context.getBean(PropertyTypeRepository.class),
        context.getBean(PropertyTypeMapper.class),
        context.getBean(PropertyTypeHook.class));
  }

  @Bean
  CrudService<Property, Long, PropertyRequest, PropertyResponse> propertyService() {
    return new GenericService<Property, Long, PropertyRequest, PropertyResponse>(
        context.getBean(PropertyRepository.class),
        context.getBean(PropertyMapper.class),
        context.getBean(GeneralHook.class));
  }
}
