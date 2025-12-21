package com.phongdnh.se121.mappers.general;

import com.phongdnh.se121.dtos.contentblock.ContentBlockResponse;
import com.phongdnh.se121.entities.general.ContentBlock;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(
    componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.IGNORE,
    uses = {FileMapper.class})
public interface ContentBlockMapper {
  ContentBlockResponse entityToResponse(ContentBlock contentBlock);
}
