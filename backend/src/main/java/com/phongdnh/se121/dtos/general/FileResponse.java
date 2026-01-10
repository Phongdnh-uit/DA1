package com.phongdnh.se121.dtos.general;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.phongdnh.se121.enums.general.FileStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class FileResponse {
  private Long id;
  private String originalName;
  private String objectName; // AWS3 Object name
  private FileStatus status;

  //  This is the presigned URL for downloading the file
  private String url;
}
