package com.phongdnh.se121.dtos.property;

import com.phongdnh.se121.entities.BaseEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WardResponse extends BaseEntity {
  private String name;
  private String code;
  private String type;
  private ProvinceResponse province;
}
