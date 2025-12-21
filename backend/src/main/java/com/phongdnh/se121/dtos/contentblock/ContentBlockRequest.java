package com.phongdnh.se121.dtos.contentblock;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ContentBlockRequest {
  // May be null for content blocks without associated files
  private Long fileId;

  // May be null for content blocks without metadata
  @Size(max = 5000, message = "Metadata size must not exceed 5000 characters")
  private JsonNode metadata;
}
