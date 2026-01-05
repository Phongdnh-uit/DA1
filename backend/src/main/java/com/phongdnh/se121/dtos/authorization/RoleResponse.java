package com.phongdnh.se121.dtos.authorization;

import com.phongdnh.se121.entities.BaseEntity;
import java.util.Set;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RoleResponse extends BaseEntity {
  private String name;
  private String description;
  private boolean isDefault;
  private boolean canManage;
  private Set<String> accessibleModules;
  private Set<Long> permissionIds;
}
