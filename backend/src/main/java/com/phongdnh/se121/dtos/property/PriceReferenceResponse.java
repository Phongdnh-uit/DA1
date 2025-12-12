package com.phongdnh.se121.dtos.property;

import com.phongdnh.se121.entities.BaseEntity;
import java.math.BigDecimal;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PriceReferenceResponse extends BaseEntity {
  private WardResponse ward;
  private PropertyTypeResponse propertyType;
  private BigDecimal averagePrice;
  private BigDecimal maxPrice;
  private BigDecimal minPrice;
  private Integer count;
}
