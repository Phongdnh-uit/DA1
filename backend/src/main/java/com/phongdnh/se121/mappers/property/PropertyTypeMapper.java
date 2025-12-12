package com.phongdnh.se121.mappers.property;

import com.phongdnh.se121.dtos.property.PropertyTypeRequest;
import com.phongdnh.se121.dtos.property.PropertyTypeResponse;
import com.phongdnh.se121.entities.property.PropertyType;
import com.phongdnh.se121.mappers.GenericMapper;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface PropertyTypeMapper
    extends GenericMapper<PropertyType, PropertyTypeRequest, PropertyTypeResponse> {}
