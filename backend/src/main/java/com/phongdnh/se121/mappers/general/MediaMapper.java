package com.phongdnh.se121.mappers.general;

import com.phongdnh.se121.dtos.general.MediaResponse;
import com.phongdnh.se121.dtos.general.UploadConfirmRequest;
import com.phongdnh.se121.entities.general.Media;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface MediaMapper {
  MediaResponse entityToResponse(Media media);

  Media requestToEntity(UploadConfirmRequest request);
}
