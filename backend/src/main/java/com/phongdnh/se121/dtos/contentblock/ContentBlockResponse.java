package com.phongdnh.se121.dtos.contentblock;

import com.fasterxml.jackson.databind.JsonNode;
import com.phongdnh.se121.dtos.general.FileResponse;
import com.phongdnh.se121.entities.BaseEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ContentBlockResponse extends BaseEntity {
  private FileResponse file;
  private JsonNode metadata;
}
