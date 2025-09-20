package com.phongdnh.se121.dtos.authorization;

import com.phongdnh.se121.entities.BaseEntity;
import com.phongdnh.se121.enums.authorization.Action;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PermissionResponseDTO extends BaseEntity {
  private String name;
  private String resource;
  private Action action;
}
