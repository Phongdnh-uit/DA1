package com.phongdnh.se121.services.file;

import com.phongdnh.se121.dtos.general.PresignedURLResponse;
import com.phongdnh.se121.dtos.general.PresignedUploadRequest;
import com.phongdnh.se121.dtos.general.PresignedUploadResponse;
import com.phongdnh.se121.entities.chat.ConversationParticipant;
import com.phongdnh.se121.entities.chat.Message;
import com.phongdnh.se121.entities.general.File;
import com.phongdnh.se121.enums.general.FileStatus;
import com.phongdnh.se121.enums.general.FileUsageStatus;
import com.phongdnh.se121.events.FileProcessedEvent;
import com.phongdnh.se121.exceptions.errors.ApiException;
import com.phongdnh.se121.exceptions.errors.ErrorCode;
import com.phongdnh.se121.mappers.general.FileMapper;
import com.phongdnh.se121.repositories.chat.MessageRepository;
import com.phongdnh.se121.repositories.general.FileRepository;
import com.phongdnh.se121.securities.SecurityUtil;
import com.phongdnh.se121.services.file.processor.FileSizeProcessor;
import com.phongdnh.se121.services.file.processor.MagicByteProcessor;
import com.phongdnh.se121.services.file.processor.VirusScanProcessor;
import com.phongdnh.se121.services.general.FileNotificationService;
import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.tika.Tika;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class FileOrchestratorServiceImpl implements FileOrchestratorService {
  private final FileMapper fileMapper;
  private final FileRepository fileRepository;
  private final StorageProvider storageProvider;
  private List<FileProcessor> fileProcessors = new ArrayList<>();
  private final ImgproxyService imgproxyService;
  private final FileNotificationService fileNotificationService;
  private final MessageRepository messageRepository;

  // file processor here
  private final VirusScanProcessor virusScanProcessor;
  private final MagicByteProcessor magicByteProcessor;
  private final FileSizeProcessor fileSizeProcessor;

  @PostConstruct
  public void init() {
    fileProcessors.add(fileSizeProcessor);
    fileProcessors.add(magicByteProcessor);
    fileProcessors.add(virusScanProcessor);
  }

  @Override
  public PresignedUploadResponse generatePresignedUploadURL(PresignedUploadRequest request) {
    if (!request.getPurpose().getAllowedTypes().contains(request.getContentType())) {
      throw new ApiException(
          ErrorCode.UPLOAD_FAILED, Map.of("contentType", "File type not allowed"));
    }
    PresignedURLResponse presignedURLResponse =
        storageProvider.generatePresignedUploadURL(request.getOriginalName());
    File file = new File();
    file.setOriginalName(request.getOriginalName());
    file.setObjectName(presignedURLResponse.getKey());
    file.setPurpose(request.getPurpose());
    file.setStatus(FileStatus.PENDING);
    file = fileRepository.save(file);
    PresignedUploadResponse response = new PresignedUploadResponse();
    response.setFile(fileMapper.entityToResponse(file));
    response.setPresignedURL(presignedURLResponse);
    return response;
  }

  @Override
  public PresignedURLResponse generatePresignedDownURL(String objectKey, String options) {
    File file =
        fileRepository
            .findOne((root, _, cb) -> cb.equal(root.get("objectName"), objectKey))
            .orElseThrow(
                () ->
                    new ApiException(ErrorCode.RESOURCE_NOT_FOUND, Map.of("objectKey", objectKey)));
    System.out.println("Generating download URL for file status: " + file.getStatus());
    if (file.getStatus() != FileStatus.ACTIVE) {
      throw new ApiException(
          ErrorCode.DOWNLOAD_FAILED, Map.of("objectKey", "File is not available for download"));
    }
    if (file.getMimeType().startsWith("image/")) {
      String url = imgproxyService.generateUrl(objectKey, options);
      PresignedURLResponse response =
          PresignedURLResponse.builder().url(url).key(objectKey).build();
      return response;
    }
    return storageProvider.generatePresignedDownloadURL(objectKey);
  }

  @Override
  public void processFile(String objectKey) {
    File file =
        fileRepository
            .findOne((root, _, cb) -> cb.equal(root.get("objectName"), objectKey))
            .orElseThrow(
                () ->
                    new ApiException(ErrorCode.RESOURCE_NOT_FOUND, Map.of("objectKey", objectKey)));
    Path tempFile = null;
    try {
      tempFile = Files.createTempFile("file-process-", ".tmp");
      try (InputStream inputStream = storageProvider.downloadFromQuarantineStream(objectKey)) {
        Files.copy(inputStream, tempFile, StandardCopyOption.REPLACE_EXISTING);
      }

      // Check file type using Apache Tika
      try (InputStream isForTypeCheck = Files.newInputStream(tempFile); ) {
        Tika tika = new Tika();
        String detectedType = tika.detect(isForTypeCheck);
        file.setMimeType(detectedType);
        if (!file.getPurpose().getAllowedTypes().contains(detectedType)) {
          file.setStatus(FileStatus.REJECTED);
          fileRepository.save(file);
          // Notify other service
          notifyFileProcessed(objectKey, FileStatus.REJECTED, null);
          throw new ApiException(
              ErrorCode.FILE_PROCESSING_FAILED, Map.of("reason", "File type not allowed"));
        }
      }

      // Process file with each processor
      for (FileProcessor processor : fileProcessors) {
        try (InputStream is = Files.newInputStream(tempFile)) {

          boolean isValid = processor.processFile(is);
          if (!isValid) {
            file.setStatus(FileStatus.REJECTED);
            fileRepository.save(file);
            // Notify other service
            notifyFileProcessed(objectKey, FileStatus.REJECTED, null);
            throw new ApiException(
                ErrorCode.FILE_PROCESSING_FAILED,
                Map.of("processor", processor.getClass().getSimpleName()));
          }
        }
      }
      storageProvider.promoteFromQuarantine(objectKey);
      file.setStatus(FileStatus.ACTIVE);
      fileRepository.save(file);
      log.info("File {} processed and activated.", objectKey);
      // Notify other service
      PresignedURLResponse presignedURLResponse = generatePresignedDownURL(objectKey, null);
      notifyFileProcessed(objectKey, FileStatus.ACTIVE, presignedURLResponse.getUrl());
    } catch (IOException e) {
      throw new ApiException(ErrorCode.DOWNLOAD_FAILED, Map.of("reason", e.getMessage()));
    } finally {
      // Clean up temp file
      if (tempFile != null) {
        try {
          Files.deleteIfExists(tempFile);
        } catch (IOException e) {
          log.warn("Failed to delete temp file: " + tempFile.toString());
        }
      }
    }
  }

  @Override
  public void deleteFile(String objectKey) {
    storageProvider.delete(objectKey);
  }

  @Scheduled(cron = "0 0 0 * * *") // Run daily at midnight
  @Async
  @Override
  public void cronjobCleanupOrphanedFiles() {
    Instant last24Hours = Instant.now().minus(24, ChronoUnit.HOURS);
    var fileToDeleted =
        fileRepository.findAll(
            (root, _, builder) ->
                builder.and(
                    builder.equal(root.get("usageStatus"), FileUsageStatus.NOT_IN_USE),
                    builder.lessThan(root.get("createdAt"), last24Hours)));
    for (var file : fileToDeleted) {
      // Case file already upload to main storage
      if (file.getStatus() == FileStatus.ACTIVE) {
        storageProvider.delete(file.getObjectName());
      }
    }
    fileRepository.deleteAll(fileToDeleted);
  }

  // ============================ HELPER ============================
  private void notifyFileProcessed(String objectKey, FileStatus status, String url) {
    FileProcessedEvent fileProcessedEvent = new FileProcessedEvent();
    fileProcessedEvent.setStatus(status);
    fileProcessedEvent.setObjectName(objectKey);
    fileProcessedEvent.setUrl(url);
    fileNotificationService.notifyFileProcessed(objectKey, fileProcessedEvent);
  }

  private void checkFileAccessible(File file) {
    Long userId = SecurityUtil.getCurrentUserId();
    boolean isRealAuthenticatd = SecurityUtil.isRealAuthenticated();
    if (file.getStatus() != FileStatus.ACTIVE) {
      throw new ApiException(
          ErrorCode.DOWNLOAD_FAILED, Map.of("objectKey", "File is not available for download"));
    }

    // Additional checks based on file purpose
    switch (file.getPurpose()) {
      case AVATAR:
        // public
        break;
      case PROPERTY_GALLERY:
        // public
        break;
      case PROPERTY_THUMBNAIL:
        // public
        break;
      case PROPERTY_FILE:
        // login, owner or admin
        if (!isRealAuthenticatd) {
          throw new ApiException(
              ErrorCode.AUTHENTICATION_REQUIRED,
              Map.of("authentication", "User must be logged in"));
        }
        break;
      case CHAT_FILE:
        // login and must be among
        if (!isRealAuthenticatd) {
          throw new ApiException(
              ErrorCode.AUTHENTICATION_REQUIRED,
              Map.of("authentication", "User must be logged in"));
        }
        // only chat participants
        Message message =
            messageRepository
                .findOne((root, _, cb) -> cb.equal(root.get("attachments").get("id"), file.getId()))
                .orElseThrow(
                    () ->
                        new ApiException(
                            ErrorCode.RESOURCE_NOT_FOUND, Map.of("fileId", "" + file.getId())));
        List<ConversationParticipant> participants = message.getConversation().getParticipants();
        boolean isParticipant =
            participants.stream().anyMatch(p -> p.getUser().getId().equals(userId));
        if (!isParticipant) {
          throw new ApiException(
              ErrorCode.FORBIDDEN, Map.of("access", "User is not a participant of the chat"));
        }
        break;
      default:
        break;
    }
  }
}
