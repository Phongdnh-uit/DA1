package com.phongdnh.se121.dtos.property;

import com.phongdnh.se121.entities.BaseEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProvinceResponse extends BaseEntity {
  private String code;
  private String name;
}
