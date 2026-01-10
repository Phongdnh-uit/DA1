package com.phongdnh.se121.services.contentblock;

import com.phongdnh.se121.dtos.contentblock.ContentBlockResponse;
import com.phongdnh.se121.dtos.contentblock.UploadCarouselRequest;
import java.util.List;

public interface ContentBlockService {
  List<ContentBlockResponse> getCarousels();

  void uploadCarouselImage(UploadCarouselRequest request);
}
