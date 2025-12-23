package com.phongdnh.se121.dtos.contentblock;

import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UploadCarouselRequest {
  private List<ContentBlockRequest> contentBlocks;
}
