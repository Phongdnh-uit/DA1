package com.phongdnh.se121.mappers.property;

import com.phongdnh.se121.dtos.property.PropertyRequest;
import com.phongdnh.se121.dtos.property.PropertyResponse;
import com.phongdnh.se121.entities.property.Property;
import com.phongdnh.se121.mappers.GenericMapper;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(
    componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.IGNORE,
    uses = {PropertyTypeMapper.class, WardMapper.class})
public interface PropertyMapper
    extends GenericMapper<Property, PropertyRequest, PropertyResponse> {}
