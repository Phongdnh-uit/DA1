package com.phongdnh.se121.dtos.wish;

import com.phongdnh.se121.entities.BaseEntity;
import com.phongdnh.se121.enums.wish.WishType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WishResponse extends BaseEntity {
  private Long identifier;

  private WishType type;
}
