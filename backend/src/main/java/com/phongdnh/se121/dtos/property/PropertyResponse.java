package com.phongdnh.se121.dtos.property;

import com.phongdnh.se121.enums.property.PropertyPurpose;
import com.phongdnh.se121.enums.property.PropertyStatus;
import java.math.BigDecimal;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PropertyResponse {
  private String title;

  private PropertyPurpose purpose;

  private Long typeId;

  private BigDecimal price;

  private String lineAddress;

  private Long wardId;

  private BigDecimal landArea;

  private BigDecimal floorArea;

  private Integer floors;

  private Integer floorNumber;

  private Integer bedrooms;

  private Integer bathrooms;

  private String direction;

  private String description;

  private Boolean hasMezzanine = false;

  private Boolean hasBasement = false;

  private Boolean hasElevator = false;

  private PropertyStatus status;
}
