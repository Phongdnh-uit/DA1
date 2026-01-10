package com.phongdnh.se121.mappers.general;

import com.phongdnh.se121.dtos.general.FileResponse;
import com.phongdnh.se121.entities.general.File;
import org.mapstruct.DecoratedWith;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@DecoratedWith(FileMapperDecorator.class)
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface FileMapper {
  FileResponse entityToResponse(File file);
}
