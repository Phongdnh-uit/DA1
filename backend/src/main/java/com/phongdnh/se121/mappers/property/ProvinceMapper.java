package com.phongdnh.se121.mappers.property;

import com.phongdnh.se121.dtos.property.ProvinceRequest;
import com.phongdnh.se121.dtos.property.ProvinceResponse;
import com.phongdnh.se121.entities.property.Province;
import com.phongdnh.se121.mappers.GenericMapper;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ProvinceMapper
    extends GenericMapper<Province, ProvinceRequest, ProvinceResponse> {}
