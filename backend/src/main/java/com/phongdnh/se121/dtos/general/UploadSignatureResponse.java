package com.phongdnh.se121.dtos.general;

import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UploadSignatureResponse {
  private String signature;
  private String timestamp;
  private String apiKey;
  private String cloudName;
  private String publicId;
  private List<String> tags;
}
