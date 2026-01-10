package com.phongdnh.se121.dtos.authorization;

import jakarta.validation.constraints.NotBlank;
import java.util.List;
import java.util.Set;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RoleRequest {
  @NotBlank private String name;
  private String description;
  private boolean isDefault = false;
  private boolean canManage = false;
  private List<Long> permissionIds;
  private Set<String> accessibleModules;
}
