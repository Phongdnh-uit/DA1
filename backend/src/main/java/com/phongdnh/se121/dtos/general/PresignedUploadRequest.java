package com.phongdnh.se121.dtos.general;

import com.phongdnh.se121.enums.general.FilePurpose;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PresignedUploadRequest {
  @NotBlank private String originalName;
  @NotBlank private String contentType;
  @NotNull private FilePurpose purpose;
}
