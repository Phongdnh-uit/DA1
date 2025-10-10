package com.phongdnh.se121.dtos.property;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProvinceRequest {
  @NotBlank private String name;
  @NotBlank private String phoneCode;
  @NotBlank private String codeName;
  @NotBlank private String divisionType;
}
