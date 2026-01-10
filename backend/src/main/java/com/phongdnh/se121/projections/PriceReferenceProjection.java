package com.phongdnh.se121.projections;

import java.math.BigDecimal;

public interface PriceReferenceProjection {
  Long getTypeId();

  Long getWardId();

  Integer getCount();

  BigDecimal getAveragePrice();

  BigDecimal getMinPrice();

  BigDecimal getMaxPrice();
}
