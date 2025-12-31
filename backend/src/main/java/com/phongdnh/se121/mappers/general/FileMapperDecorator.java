package com.phongdnh.se121.mappers.general;

import com.phongdnh.se121.dtos.general.FileResponse;
import com.phongdnh.se121.entities.general.File;
import com.phongdnh.se121.enums.general.FileStatus;
import com.phongdnh.se121.services.file.StorageProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

public class FileMapperDecorator implements FileMapper {

  @Autowired
  @Qualifier("delegate")
  private FileMapper delegate;

  @Autowired private StorageProvider storageProvider;

  @Override
  public FileResponse entityToResponse(File file) {
    FileResponse response = delegate.entityToResponse(file);
    if (file != null && file.getStatus() == FileStatus.ACTIVE) {
      String presignedUrl =
          storageProvider.generatePresignedDownloadURL(file.getObjectName()).getUrl();
      response.setUrl(presignedUrl);
    }
    return response;
  }
}
