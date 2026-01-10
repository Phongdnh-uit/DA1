package com.phongdnh.se121.dtos.general;

import java.util.Map;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SMSRequest {
  private String phoneNumber;
  private String message;

  // private String templateCode; // ZNS
  Map<String, String> params;
}
