package com.phongdnh.se121.mappers.property;

import com.phongdnh.se121.dtos.property.DistrictRequest;
import com.phongdnh.se121.dtos.property.DistrictResponse;
import com.phongdnh.se121.entities.property.District;
import com.phongdnh.se121.mappers.GenericMapper;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface DistrictMapper
    extends GenericMapper<District, DistrictRequest, DistrictResponse> {}
