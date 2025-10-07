package com.phongdnh.se121.dtos.property;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DistrictRequest {
  @NotBlank private String name;
  @NotBlank private String code;
  @NotNull private Long provinceId;
}
