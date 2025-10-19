package com.phongdnh.se121.controllers.general;

import com.phongdnh.se121.dtos.ApiResponse;
import com.phongdnh.se121.dtos.general.UploadSignatureResponse;
import com.phongdnh.se121.services.general.UploadService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@Tag(name = "Upload")
@RequestMapping("/uploads")
@RestController
public class UploadController {
  private final UploadService uploadService;

  @DeleteMapping("/{id}")
  public ResponseEntity<ApiResponse<Void>> deleteFile(@PathVariable("id") Long id) {
    uploadService.deleteFile(id);
    return ResponseEntity.ok(ApiResponse.ok(null));
  }

  @PostMapping("/signature")
  public ResponseEntity<ApiResponse<UploadSignatureResponse>> getUploadSignature() {
    return ResponseEntity.ok(ApiResponse.ok(uploadService.getUploadSignature()));
  }
}
