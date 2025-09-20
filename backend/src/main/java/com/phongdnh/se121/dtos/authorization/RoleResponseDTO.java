package com.phongdnh.se121.dtos.authorization;

import com.phongdnh.se121.entities.BaseEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RoleResponseDTO extends BaseEntity {
  private String name;
  private String description;
}
