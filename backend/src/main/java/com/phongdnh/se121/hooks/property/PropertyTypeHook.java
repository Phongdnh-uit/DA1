package com.phongdnh.se121.hooks.property;

import org.springframework.stereotype.Component;

import com.phongdnh.se121.dtos.property.PropertyTypeRequest;
import com.phongdnh.se121.dtos.property.PropertyTypeResponse;
import com.phongdnh.se121.entities.property.PropertyType;
import com.phongdnh.se121.hooks.DefaultHook;

@Component
public class PropertyTypeHook
    extends DefaultHook<PropertyType, Long, PropertyTypeRequest, PropertyTypeResponse> {}
