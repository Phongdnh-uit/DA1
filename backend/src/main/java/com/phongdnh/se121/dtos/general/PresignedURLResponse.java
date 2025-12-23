package com.phongdnh.se121.dtos.general;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class PresignedURLResponse {
  private String url;
  private String key;
  private long expirationInSeconds;
}
