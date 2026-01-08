package com.phongdnh.se121.entities.property;

import com.phongdnh.se121.entities.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "price_reference")
public class PriceReference extends BaseEntity {
  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "ward_id", nullable = false)
  private Ward ward;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "property_type_id", nullable = false)
  private PropertyType propertyType;

  private BigDecimal averagePrice;
  private BigDecimal maxPrice;
  private BigDecimal minPrice;
  private Integer count;
}
