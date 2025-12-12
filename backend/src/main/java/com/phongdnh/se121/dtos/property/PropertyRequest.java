package com.phongdnh.se121.dtos.property;

import com.phongdnh.se121.dtos.general.UploadConfirmRequest;
import com.phongdnh.se121.enums.property.Direction;
import com.phongdnh.se121.enums.property.PropertyPurpose;
import com.phongdnh.se121.enums.property.PropertyStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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

  @Min(0)
  @NotNull
  private BigDecimal price;

  private String lineAddress;

  @NotNull private Long provinceId;

  @NotNull private Long wardId;

  @Min(0)
  private BigDecimal landArea;

  @Min(0)
  private BigDecimal floorArea;

  @Min(0)
  private Integer floors;

  @Min(0)
  private Integer floorNumber;

  @Min(0)
  private Integer bedrooms;

  @Min(0)
  private Integer bathrooms;

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

  private List<UploadConfirmRequest> medias;

  private Location location;
}
