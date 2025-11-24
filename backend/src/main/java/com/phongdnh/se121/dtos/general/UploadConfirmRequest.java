package com.phongdnh.se121.dtos.general;

import com.phongdnh.se121.dtos.Action.Create;
import com.phongdnh.se121.enums.general.MediaPurpose;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UploadConfirmRequest {
  @NotBlank private String publicId;
  @NotNull private Long version;

  @NotBlank(groups = {Create.class})
  private String signature;

  @NotBlank private String secureUrl;
  @NotNull private Integer width;
  @NotNull private Integer height;
  @NotBlank private String format;
  @NotBlank private String resourceType;
  @NotNull private Long bytes;
  @NotNull private MediaPurpose purpose;
}
