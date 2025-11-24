package com.phongdnh.se121.dtos.property;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Location {
  @NotNull private Double longitude;
  @NotNull private Double latitude;
}
