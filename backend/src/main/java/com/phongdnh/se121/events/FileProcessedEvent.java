package com.phongdnh.se121.events;

import com.phongdnh.se121.enums.general.FileStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FileProcessedEvent {
  private String objectName;
  private FileStatus status;
  private String url;
}
