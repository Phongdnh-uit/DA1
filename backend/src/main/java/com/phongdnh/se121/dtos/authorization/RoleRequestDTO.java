package com.phongdnh.se121.dtos.authorization;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RoleRequestDTO {
  @NotBlank private String name;
  private String description;
  private List<Long> permissionIds;
}
