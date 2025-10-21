package com.phongdnh.se121.entities.property;

import com.phongdnh.se121.entities.BaseEntity;
import com.phongdnh.se121.enums.property.Direction;
import com.phongdnh.se121.enums.property.PropertyPurpose;
import com.phongdnh.se121.enums.property.PropertyStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Table(name = "properties")
public class Property extends BaseEntity {

  @Column(nullable = false)
  private String title;

  @Column(nullable = false)
  @Enumerated(EnumType.STRING)
  private PropertyPurpose purpose;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "type_Id")
  private PropertyType type;

  @Column(nullable = false, precision = 15, scale = 2)
  private BigDecimal price;

  @Column(nullable = false)
  private String lineAddress;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "ward_Id")
  private Ward ward;

  @Column(precision = 10, scale = 2)
  private BigDecimal landArea;

  @Column(precision = 10, scale = 2)
  private BigDecimal floorArea;

  private Integer floors;

  private Integer floorNumber;

  private Integer bedrooms;

  private Integer bathrooms;

  private Double entranceRoadWidth;

  @Enumerated(EnumType.STRING)
  private Direction balconyDirection;

  @Enumerated(EnumType.STRING)
  private Direction direction;

  private String interior;

  @Column(columnDefinition = "TEXT")
  private String description;

  private Boolean hasMezzanine = false;

  private Boolean hasBasement = false;

  private Boolean hasElevator = false;

  @Column(nullable = false)
  @Enumerated(EnumType.STRING)
  private PropertyStatus status;
}
