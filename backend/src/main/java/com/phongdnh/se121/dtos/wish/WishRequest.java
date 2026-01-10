package com.phongdnh.se121.dtos.wish;

import com.phongdnh.se121.enums.wish.WishType;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WishRequest {
  @NotNull private Long identifier;

  @NotNull private WishType type;
}
