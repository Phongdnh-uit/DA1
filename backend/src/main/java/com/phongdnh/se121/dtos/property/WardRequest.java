package com.phongdnh.se121.dtos.property;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WardRequest {
  @NotBlank private String name;
  @NotBlank private String code;
  @NotBlank private String type;
  @NotNull private Long provinceId;
}
