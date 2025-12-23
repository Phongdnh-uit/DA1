package com.phongdnh.se121.mappers.property;

import com.phongdnh.se121.dtos.general.FileResponse;
import com.phongdnh.se121.dtos.property.PropertyRequest;
import com.phongdnh.se121.dtos.property.PropertyResponse;
import com.phongdnh.se121.entities.property.Property;
import com.phongdnh.se121.entities.property.PropertyFile;
import com.phongdnh.se121.enums.general.FilePurpose;
import com.phongdnh.se121.mappers.GenericMapper;
import com.phongdnh.se121.mappers.general.FileMapper;
import java.util.List;
import java.util.stream.Collectors;
import org.locationtech.jts.geom.Point;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.mapstruct.ReportingPolicy;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(
    componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.IGNORE,
    uses = {PropertyTypeMapper.class, WardMapper.class})
public abstract class PropertyMapper
    implements GenericMapper<Property, PropertyRequest, PropertyResponse> {

  // Use this due to decorator issues with @Autowired in MapStruct
  @Autowired private FileMapper fileMapper;

  @Override
  @Mapping(source = "location", target = "location", ignore = true)
  public abstract Property requestToEntity(PropertyRequest request);

  @Mapping(source = "location", target = "location.latitude", qualifiedByName = "pointToLatitude")
  @Mapping(source = "location", target = "location.longitude", qualifiedByName = "pointToLongitude")
  @Mapping(source = "files", target = "documents", qualifiedByName = "mapDocuments")
  @Mapping(source = "files", target = "thumbnail", qualifiedByName = "mapThumbnail")
  @Mapping(source = "files", target = "galleries", qualifiedByName = "mapGalleries")
  @Override
  public abstract PropertyResponse entityToResponse(Property entity);

  @Override
  @Mapping(source = "location", target = "location", ignore = true)
  public abstract void partialUpdate(PropertyRequest request, @MappingTarget Property entity);

  @Named("pointToLatitude")
  protected Double pointToLatitude(Point point) {
    return point != null ? point.getY() : null;
  }

  @Named("pointToLongitude")
  protected Double pointToLongitude(Point point) {
    return point != null ? point.getX() : null;
  }

  @Named("mapDocuments")
  protected List<FileResponse> mapDocuments(List<PropertyFile> files) {
    if (files == null) {
      return null;
    }
    return files.stream()
        .map(PropertyFile::getFile)
        .filter(file -> file.getPurpose() == FilePurpose.PROPERTY_FILE)
        .map(this.fileMapper::entityToResponse)
        .collect(Collectors.toList());
  }

  @Named("mapThumbnail")
  protected FileResponse mapThumbnail(List<PropertyFile> files) {
    if (files == null) {
      return null;
    }
    return files.stream()
        .map(PropertyFile::getFile)
        .filter(file -> file.getPurpose() == FilePurpose.PROPERTY_THUMBNAIL)
        .map(this.fileMapper::entityToResponse)
        .findFirst()
        .orElse(null);
  }

  @Named("mapGalleries")
  protected List<FileResponse> mapGalleries(List<PropertyFile> files) {
    if (files == null) {
      return null;
    }
    return files.stream()
        .map(PropertyFile::getFile)
        .filter(file -> file.getPurpose() == FilePurpose.PROPERTY_GALLERY)
        .map(this.fileMapper::entityToResponse)
        .collect(Collectors.toList());
  }
}
