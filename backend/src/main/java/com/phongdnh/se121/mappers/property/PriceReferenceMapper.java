package com.phongdnh.se121.mappers.property;

import com.phongdnh.se121.dtos.property.PriceReferenceResponse;
import com.phongdnh.se121.entities.property.PriceReference;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE, uses = {WardMapper.class, PropertyTypeMapper.class})
public interface PriceReferenceMapper {
  PriceReferenceResponse entityToResponse(PriceReference priceReference);
}
