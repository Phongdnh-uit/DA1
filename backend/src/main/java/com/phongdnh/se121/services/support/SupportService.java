package com.phongdnh.se121.services.support;

import com.phongdnh.se121.dtos.PageResponse;
import com.phongdnh.se121.dtos.support.AdminSupportResponse;
import com.phongdnh.se121.dtos.support.ProcessSupportRequest;
import com.phongdnh.se121.dtos.support.SummarySupportResponse;
import com.phongdnh.se121.dtos.support.SupportRequest;
import com.phongdnh.se121.dtos.support.SupportResponse;
import com.phongdnh.se121.entities.support.SupportTicket;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

public interface SupportService {

  PageResponse<SummarySupportResponse> getAdminSupportTickets(
      Specification<SupportTicket> specification, Pageable pageable);

  PageResponse<SummarySupportResponse> getClientSupportTickets(
      Specification<SupportTicket> specification, Pageable pageable);

  SupportResponse getSupportTicketById(Long ticketId);

  AdminSupportResponse getAdminSupportTicketById(Long ticketId);

  SupportResponse createSupportTicket(SupportRequest request);

  void processSupportTickets(Long id, ProcessSupportRequest request);

  void closeSupportTicket(Long ticketId);
}
