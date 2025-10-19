package com.phongdnh.se121.mappers.property;

import com.phongdnh.se121.dtos.property.WardRequest;
import com.phongdnh.se121.dtos.property.WardResponse;
import com.phongdnh.se121.entities.property.Ward;
import com.phongdnh.se121.mappers.GenericMapper;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(
    componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.IGNORE,
    uses = {ProvinceMapper.class})
public interface WardMapper extends GenericMapper<Ward, WardRequest, WardResponse> {}
