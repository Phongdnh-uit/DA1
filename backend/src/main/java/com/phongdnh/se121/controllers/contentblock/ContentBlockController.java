package com.phongdnh.se121.controllers.contentblock;

import com.phongdnh.se121.dtos.ApiResponse;
import com.phongdnh.se121.dtos.contentblock.ContentBlockResponse;
import com.phongdnh.se121.dtos.contentblock.UploadCarouselRequest;
import com.phongdnh.se121.services.contentblock.ContentBlockService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Content Block")
@RequestMapping("/content-blocks")
@RestController
@RequiredArgsConstructor
public class ContentBlockController {
  private final ContentBlockService contentBlockService;

  @GetMapping("/carousels")
  public ResponseEntity<ApiResponse<List<ContentBlockResponse>>> getCarousels() {
    return ResponseEntity.ok(ApiResponse.ok(contentBlockService.getCarousels()));
  }

  @PostMapping("/upload-carousel")
  public ResponseEntity<ApiResponse<Void>> uploadCarousel(
      @Valid @RequestBody UploadCarouselRequest request) {
    contentBlockService.uploadCarouselImage(request);
    return ResponseEntity.ok(ApiResponse.ok(null));
  }
}
