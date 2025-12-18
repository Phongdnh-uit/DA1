package com.phongdnh.se121.mappers.property;

import com.phongdnh.se121.dtos.general.FileResponse;
import com.phongdnh.se121.dtos.property.PropertyRequest;
import com.phongdnh.se121.dtos.property.PropertyResponse;
import com.phongdnh.se121.entities.general.File;
import com.phongdnh.se121.entities.property.Property;
import com.phongdnh.se121.entities.property.PropertyFile;
import com.phongdnh.se121.mappers.GenericMapper;
import java.util.List;
import java.util.stream.Collectors;
import org.locationtech.jts.geom.Point;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.mapstruct.ReportingPolicy;

@Mapper(
    componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.IGNORE,
    uses = {PropertyTypeMapper.class, WardMapper.class})
public interface PropertyMapper extends GenericMapper<Property, PropertyRequest, PropertyResponse> {

  @Override
  @Mapping(source = "location", target = "location", ignore = true)
  Property requestToEntity(PropertyRequest request);

  @Mapping(source = "location", target = "location.latitude", qualifiedByName = "pointToLatitude")
  @Mapping(source = "location", target = "location.longitude", qualifiedByName = "pointToLongitude")
  @Mapping(source = "documents", target = "documents", qualifiedByName = "mapDocuments")
  @Override
  PropertyResponse entityToResponse(Property entity);

  @Override
  @Mapping(source = "location", target = "location", ignore = true)
  void partialUpdate(PropertyRequest request, @MappingTarget Property entity);

  @Named("pointToLatitude")
  default Double pointToLatitude(Point point) {
    return point != null ? point.getY() : null;
  }

  @Named("pointToLongitude")
  default Double pointToLongitude(Point point) {
    return point != null ? point.getX() : null;
  }

  @Named("mapDocuments")
  default List<FileResponse> mapDocuments(List<PropertyFile> documents) {
    if (documents == null) {
      return null;
    }
    return documents.stream()
        .map(PropertyFile::getFile)
        .map(this::mapFile)
        .collect(Collectors.toList());
  }

  FileResponse mapFile(File file);
}
