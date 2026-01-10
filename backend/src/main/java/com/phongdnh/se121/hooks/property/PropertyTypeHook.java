package com.phongdnh.se121.hooks.property;

import com.phongdnh.se121.dtos.property.PropertyTypeRequest;
import com.phongdnh.se121.dtos.property.PropertyTypeResponse;
import com.phongdnh.se121.entities.property.PropertyType;
import com.phongdnh.se121.hooks.GenericHook;
import org.springframework.stereotype.Component;

@Component
public class PropertyTypeHook
    implements GenericHook<PropertyType, Long, PropertyTypeRequest, PropertyTypeResponse> {}
