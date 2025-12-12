package com.phongdnh.se121.dtos.property;

import com.phongdnh.se121.dtos.general.MediaResponse;
import com.phongdnh.se121.entities.BaseEntity;
import com.phongdnh.se121.enums.property.Direction;
import com.phongdnh.se121.enums.property.PropertyPurpose;
import com.phongdnh.se121.enums.property.PropertyStatus;
import java.math.BigDecimal;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PropertyResponse extends BaseEntity {
  private String title;

  private PropertyPurpose purpose;

  private PropertyTypeResponse type;

  private BigDecimal price;

  private String lineAddress;

  private WardResponse ward;

  private BigDecimal landArea;

  private BigDecimal floorArea;

  private Integer floors;

  private Integer floorNumber;

  private Integer bedrooms;

  private Integer bathrooms;

  private Direction direction;

  private String description;

  private Double entranceRoadWidth;

  private Direction balconyDirection;

  private Boolean hasMezzanine = false;

  private Boolean hasBasement = false;

  private Boolean hasElevator = false;

  private PropertyStatus status;

  private String interior;

  private List<MediaResponse> medias;

  private Location location;
}
