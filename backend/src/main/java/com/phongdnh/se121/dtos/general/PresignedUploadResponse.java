package com.phongdnh.se121.dtos.general;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PresignedUploadResponse {
  private PresignedURLResponse presignedURL;
  private FileResponse file;
}
