package com.phongdnh.se121.enums.property;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum PropertyPurpose {
  FOR_SALE("Bán"),
  FOR_RENT("Cho thuê");

  private final String name;
}
