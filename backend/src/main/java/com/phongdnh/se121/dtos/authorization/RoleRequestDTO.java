package com.phongdnh.se121.dtos.authorization;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RoleRequestDTO {
  @NotBlank private String name;
  private String description;
}
