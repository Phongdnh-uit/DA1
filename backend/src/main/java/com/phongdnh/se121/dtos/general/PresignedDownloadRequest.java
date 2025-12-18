package com.phongdnh.se121.dtos.general;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PresignedDownloadRequest {
  @NotBlank private String objectKey;
  private String options;
}
