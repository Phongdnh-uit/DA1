package com.phongdnh.se121.dtos.authorization;

import com.phongdnh.se121.enums.authorization.Action;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PermissionRequestDTO {
  @NotBlank private String name;
  @NotBlank private String resource;
  @NotNull private Action action;
}
