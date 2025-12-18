package com.phongdnh.se121.dtos.general;

import com.phongdnh.se121.enums.general.FileStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FileResponse {
  private Long id;
  private String originalName;
  private String objectName; // AWS3 Object name
  private FileStatus status;
}
