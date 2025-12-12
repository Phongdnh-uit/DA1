package com.phongdnh.se121.dtos.authorization;

import com.phongdnh.se121.entities.BaseEntity;
import com.phongdnh.se121.enums.authorization.Method;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PermissionResponse extends BaseEntity {
  private String name;
  private String resource;
  private String urlPattern;
  private Method method;
  private String code;
}
