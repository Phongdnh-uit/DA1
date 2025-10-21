package com.phongdnh.se121.dtos.property;

import com.phongdnh.se121.dtos.general.UploadConfirmRequest;
import com.phongdnh.se121.enums.property.Direction;
import com.phongdnh.se121.enums.property.PropertyPurpose;
import com.phongdnh.se121.enums.property.PropertyStatus;
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

  @NotNull private BigDecimal price;

  @NotBlank private String lineAddress;

  @NotNull private Long provinceId;

  @NotNull private Long wardId;

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
    
  private String interior;

  @NotNull private PropertyStatus status;

  private List<UploadConfirmRequest> medias;
}
