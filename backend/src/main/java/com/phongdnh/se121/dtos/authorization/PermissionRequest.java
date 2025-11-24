package com.phongdnh.se121.dtos.authorization;

import com.phongdnh.se121.enums.authorization.Method;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PermissionRequest {
  @NotBlank private String name;
  @NotBlank private String resource;
  @NotBlank private String urlPattern;
  @NotNull private Method method;
}
