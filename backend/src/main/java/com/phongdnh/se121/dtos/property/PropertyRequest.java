package com.phongdnh.se121.dtos.property;

import com.phongdnh.se121.enums.property.Direction;
import com.phongdnh.se121.enums.property.PropertyPurpose;
import com.phongdnh.se121.enums.property.PropertyStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PropertyRequest {
  @NotBlank private String title;

  @NotNull private PropertyPurpose purpose;

  @NotNull private Long typeId;

  @PositiveOrZero @NotNull private BigDecimal price;

  private String lineAddress;

  @NotNull private Long provinceId;

  @NotNull private Long wardId;

  @PositiveOrZero private BigDecimal landArea;

  @PositiveOrZero private BigDecimal floorArea;

  @PositiveOrZero private Integer floors;

  @PositiveOrZero private Integer floorNumber;

  @PositiveOrZero private Integer bedrooms;

  @PositiveOrZero private Integer bathrooms;

  private Direction direction;

  private String description;

  @Min(0)
  private Double entranceRoadWidth;

  private Direction balconyDirection;

  private Boolean hasMezzanine = false;

  private Boolean hasBasement = false;

  private Boolean hasElevator = false;

  private String interior;

  @NotNull private PropertyStatus status;

  private Location location;

  private List<Long> documentIds;

  @NotNull private Long thumbnailId;

  private List<Long> galleryIds;
}
