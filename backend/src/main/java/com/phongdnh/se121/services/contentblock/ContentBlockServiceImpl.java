package com.phongdnh.se121.services.contentblock;

import com.phongdnh.se121.dtos.contentblock.ContentBlockRequest;
import com.phongdnh.se121.dtos.contentblock.ContentBlockResponse;
import com.phongdnh.se121.dtos.contentblock.UploadCarouselRequest;
import com.phongdnh.se121.entities.general.ContentBlock;
import com.phongdnh.se121.entities.general.File;
import com.phongdnh.se121.enums.general.FilePurpose;
import com.phongdnh.se121.enums.general.FileUsageStatus;
import com.phongdnh.se121.mappers.general.ContentBlockMapper;
import com.phongdnh.se121.repositories.general.ContentBlockRepository;
import com.phongdnh.se121.repositories.general.FileRepository;
import com.phongdnh.se121.securities.SecurityUtil;
import jakarta.transaction.Transactional;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class ContentBlockServiceImpl implements ContentBlockService {

  private final FileRepository fileRepository;
  private final ContentBlockMapper contentBlockMapper;
  private final ContentBlockRepository contentBlockRepository;

  @Override
  public List<ContentBlockResponse> getCarousels() {
    List<ContentBlock> ctBlock =
        contentBlockRepository.findAll(
            (root, _, builder) ->
                builder.and(
                    builder.equal(root.get("file").get("purpose"), FilePurpose.CAROUSEL_IMAGE),
                    builder.equal(root.get("file").get("usageStatus"), FileUsageStatus.IN_USE)));
    return ctBlock.stream().map(contentBlockMapper::entityToResponse).toList();
  }

  @Override
  @Transactional
  public void uploadCarouselImage(UploadCarouselRequest request) {
    Long userId = SecurityUtil.getCurrentUserId();
    // Revoke old carousel images
    List<ContentBlock> oldCarousels =
        contentBlockRepository.findAll(
            (root, _, builder) ->
                builder.and(
                    builder.equal(root.get("file").get("purpose"), FilePurpose.CAROUSEL_IMAGE),
                    builder.equal(root.get("file").get("usageStatus"), FileUsageStatus.IN_USE)));

    List<File> oldFiles = oldCarousels.stream().map(ContentBlock::getFile).toList();
    oldFiles.forEach(file -> file.setUsageStatus(FileUsageStatus.NOT_IN_USE));
    fileRepository.saveAll(oldFiles);
    contentBlockRepository.deleteAll(oldCarousels);

    // Save new carousel image
    // Delete content block if not contain file
    request.getContentBlocks().removeIf(cb -> cb.getFileId() == null);
    List<File> newFile =
        fileRepository.findAll(
            (root, _, builder) ->
                builder.and(
                    root.get("id")
                        .in(
                            request.getContentBlocks().stream()
                                .filter(cb -> cb.getFileId() != null)
                                .map(ContentBlockRequest::getFileId)
                                .toList()),
                    builder.equal(root.get("purpose"), FilePurpose.CAROUSEL_IMAGE),
                    builder.equal(root.get("usageStatus"), FileUsageStatus.NOT_IN_USE),
                    builder.equal(root.get("createdBy"), userId)));
    newFile.forEach(file -> file.setUsageStatus(FileUsageStatus.IN_USE));
    List<ContentBlock> newContentBlocks =
        request.getContentBlocks().stream()
            .map(
                cbRequest -> {
                  File file =
                      newFile.stream()
                          .filter(f -> f.getId().equals(cbRequest.getFileId()))
                          .findFirst()
                          .orElseThrow();
                  ContentBlock contentBlock = new ContentBlock();
                  contentBlock.setFile(file);
                  contentBlock.setMetadata(cbRequest.getMetadata());
                  return contentBlock;
                })
            .toList();
    fileRepository.saveAll(newFile);
    contentBlockRepository.saveAll(newContentBlocks);
  }
}
