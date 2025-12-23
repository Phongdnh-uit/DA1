package com.phongdnh.se121.controllers.general;

import com.phongdnh.se121.dtos.ApiResponse;
import com.phongdnh.se121.dtos.general.PresignedDownloadRequest;
import com.phongdnh.se121.dtos.general.PresignedURLResponse;
import com.phongdnh.se121.dtos.general.PresignedUploadRequest;
import com.phongdnh.se121.dtos.general.PresignedUploadResponse;
import com.phongdnh.se121.services.file.FileOrchestratorService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "File")
@RequestMapping("/files")
@RequiredArgsConstructor
@RestController
public class FileController {
  @Value("${minio.credentials.webhook-token}")
  private String minIOWebhookApiKey;

  private final FileOrchestratorService fileOrchestratorService;

  @PostMapping("/upload/signed-url")
  public ResponseEntity<ApiResponse<PresignedUploadResponse>> getUploadSignedUrl(
      @Valid @RequestBody PresignedUploadRequest request) {
    return ResponseEntity.ok(
        ApiResponse.ok(fileOrchestratorService.generatePresignedUploadURL(request)));
  }

  @PostMapping("/download/signed-url")
  public ResponseEntity<ApiResponse<PresignedURLResponse>> getDownloadSignedUrl(
      @Valid @RequestBody PresignedDownloadRequest request) {
    return ResponseEntity.ok(
        ApiResponse.ok(
            fileOrchestratorService.generatePresignedDownURL(
                request.getObjectKey(), request.getOptions())));
  }

  @DeleteMapping("/{objectKey}")
  public ResponseEntity<ApiResponse<Void>> deleteFile(@PathVariable("objectKey") String objectKey) {
    fileOrchestratorService.deleteFile(objectKey);
    return ResponseEntity.ok(ApiResponse.ok(null));
  }

  // ============================ STORAGE WEB HOOK ============================
  // @PostMapping("/storage/webhook/callback")
  // public ResponseEntity<ApiResponse<Void>> storageWebHook(
  //     @RequestHeader("Authorization") String apiKey, @RequestBody Map<String, Object> payload) {
  //   if (!minIOWebhookApiKey.equals(apiKey)) {
  //     throw new ApiException(ErrorCode.FORBIDDEN);
  //   }
  //   System.out.println("Received MinIO webhook payload: " + payload);
  //   // fileOrchestratorService.processFile(objectKey);
  //   return ResponseEntity.ok(ApiResponse.ok(null));
  // }
}
