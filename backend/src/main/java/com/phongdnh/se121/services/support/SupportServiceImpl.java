package com.phongdnh.se121.services.support;

import com.phongdnh.se121.dtos.PageResponse;
import com.phongdnh.se121.dtos.support.AdminSupportResponse;
import com.phongdnh.se121.dtos.support.ProcessSupportRequest;
import com.phongdnh.se121.dtos.support.SummarySupportResponse;
import com.phongdnh.se121.dtos.support.SupportRequest;
import com.phongdnh.se121.dtos.support.SupportResponse;
import com.phongdnh.se121.entities.support.SupportAttachment;
import com.phongdnh.se121.entities.support.SupportTicket;
import com.phongdnh.se121.enums.general.FilePurpose;
import com.phongdnh.se121.enums.general.FileUsageStatus;
import com.phongdnh.se121.enums.support.SupportTicketStatus;
import com.phongdnh.se121.exceptions.errors.ApiException;
import com.phongdnh.se121.exceptions.errors.ErrorCode;
import com.phongdnh.se121.mappers.support.SupportTicketMapper;
import com.phongdnh.se121.repositories.general.FileRepository;
import com.phongdnh.se121.repositories.support.SupportTicketRepository;
import com.phongdnh.se121.securities.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class SupportServiceImpl implements SupportService {
  private final SupportTicketRepository supportTicketRepository;
  private final SupportTicketMapper supportTicketMapper;
  private final FileRepository fileRepository;

  @Override
  public PageResponse<SummarySupportResponse> getAdminSupportTickets(
      Specification<SupportTicket> specification, Pageable pageable) {
    Page<SupportTicket> supportTickets = supportTicketRepository.findAll(specification, pageable);
    return PageResponse.fromPage(supportTickets.map(supportTicketMapper::entityToSummary));
  }

  @Override
  public PageResponse<SummarySupportResponse> getClientSupportTickets(
      Specification<SupportTicket> specification, Pageable pageable) {
    Long userId = SecurityUtil.getCurrentUserId();
    Specification<SupportTicket> finalSpec =
        (root, _, builder) -> builder.equal(root.get("createdBy"), userId);
    finalSpec = finalSpec.and(specification);

    Page<SupportTicket> supportTickets = supportTicketRepository.findAll(finalSpec, pageable);
    return PageResponse.fromPage(supportTickets.map(supportTicketMapper::entityToSummary));
  }

  @Override
  public SupportResponse getSupportTicketById(Long ticketId) {
    Long userId = SecurityUtil.getCurrentUserId();
    SupportTicket supportTicket =
        supportTicketRepository
            .findOne(
                (root, _, builder) ->
                    builder.and(
                        builder.and(
                            builder.equal(root.get("id"), ticketId),
                            builder.equal(root.get("createdBy"), userId))))
            .orElseThrow(() -> new ApiException(ErrorCode.RESOURCE_NOT_FOUND));
    return supportTicketMapper.entityToClientResponse(supportTicket);
  }

  @Override
  public AdminSupportResponse getAdminSupportTicketById(Long ticketId) {
    SupportTicket supportTicket =
        supportTicketRepository
            .findById(ticketId)
            .orElseThrow(() -> new ApiException(ErrorCode.RESOURCE_NOT_FOUND));
    return supportTicketMapper.entityToAdminResponse(supportTicket);
  }

  @Override
  public SupportResponse createSupportTicket(SupportRequest request) {
    var userDetail = SecurityUtil.getCurrentUserDetails();
    SupportTicket supportTicket = supportTicketMapper.requestToEntity(request);
    supportTicket.setUserId(userDetail.getId());
    supportTicket.setUserName(userDetail.getFullName());
    supportTicket.setUserEmail(userDetail.getEmail());
    supportTicket.setStatus(SupportTicketStatus.OPEN);
    // Handle attachments if any
    if (request.getAttachmentIds() != null && !request.getAttachmentIds().isEmpty()) {
      var attachments =
          fileRepository.findAll(
              (root, _, builder) ->
                  builder.and(
                      root.get("id").in(request.getAttachmentIds()),
                      builder.equal(root.get("purpose"), FilePurpose.SUPPORT_TICKET_ATTACHMENT),
                      builder.and(builder.equal(root.get("createdBy"), userDetail.getId()))));
      var ticketAttachments =
          attachments.stream()
              .map(
                  file -> {
                    SupportAttachment ticketAttachment = new SupportAttachment();
                    ticketAttachment.setSupportTicket(supportTicket);
                    ticketAttachment.setFile(file);
                    return ticketAttachment;
                  })
              .toList();
      supportTicket.setAttachments(ticketAttachments);
      attachments.stream().forEach(att -> att.setUsageStatus(FileUsageStatus.IN_USE));
    }
    var savedSupportTicket = supportTicketRepository.save(supportTicket);
    return supportTicketMapper.entityToClientResponse(savedSupportTicket);
  }

  @Override
  public void processSupportTickets(Long id, ProcessSupportRequest request) {
    SupportTicket supportTicket =
        supportTicketRepository
            .findById(id)
            .orElseThrow(() -> new ApiException(ErrorCode.RESOURCE_NOT_FOUND));
    supportTicketMapper.partialUpdate(request, supportTicket);
    supportTicket.setStatus(SupportTicketStatus.RESOLVED);
    supportTicketRepository.save(supportTicket);
  }

  @Override
  public void closeSupportTicket(Long ticketId) {
    SupportTicket supportTicket =
        supportTicketRepository
            .findById(ticketId)
            .orElseThrow(() -> new ApiException(ErrorCode.RESOURCE_NOT_FOUND));
    supportTicket.setStatus(SupportTicketStatus.CLOSED);
  }
}
