package com.phongdnh.se121.controllers.support;

import com.phongdnh.se121.dtos.ApiResponse;
import com.phongdnh.se121.dtos.PageResponse;
import com.phongdnh.se121.dtos.support.AdminSupportResponse;
import com.phongdnh.se121.dtos.support.ProcessSupportRequest;
import com.phongdnh.se121.dtos.support.SummarySupportResponse;
import com.phongdnh.se121.dtos.support.SupportRequest;
import com.phongdnh.se121.dtos.support.SupportResponse;
import com.phongdnh.se121.entities.support.SupportTicket;
import com.phongdnh.se121.services.support.SupportService;
import io.github.perplexhub.rsql.RSQLJPASupport;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Support Controller")
@RequestMapping("/supports")
@RequiredArgsConstructor
@RestController
public class SupportController {
  private final SupportService supportService;

  @GetMapping("/client")
  private ResponseEntity<ApiResponse<PageResponse<SummarySupportResponse>>> getClientSupportTickets(
      @ParameterObject Pageable pageable,
      @RequestParam(value = "filter", required = false) String filter) {
    Specification<SupportTicket> spec = RSQLJPASupport.toSpecification(filter);
    return ResponseEntity.ok(
        ApiResponse.ok(supportService.getClientSupportTickets(spec, pageable)));
  }

  @GetMapping("/client/{id}")
  private ResponseEntity<ApiResponse<SupportResponse>> getClientSupportTicketById(
      @PathVariable("id") Long id) {
    return ResponseEntity.ok(ApiResponse.ok(supportService.getSupportTicketById(id)));
  }

  @GetMapping("/admin")
  private ResponseEntity<ApiResponse<PageResponse<SummarySupportResponse>>> getAdminSupportTickets(
      @ParameterObject Pageable pageable,
      @RequestParam(value = "filter", required = false) String filter) {
    Specification<SupportTicket> spec = RSQLJPASupport.toSpecification(filter);
    return ResponseEntity.ok(ApiResponse.ok(supportService.getAdminSupportTickets(spec, pageable)));
  }

  @GetMapping("/admin/{id}")
  private ResponseEntity<ApiResponse<AdminSupportResponse>> getAdminSupportTicketById(
      @PathVariable("id") Long id) {
    return ResponseEntity.ok(ApiResponse.ok(supportService.getAdminSupportTicketById(id)));
  }

  @PostMapping
  private ResponseEntity<ApiResponse<SupportResponse>> createSupportTicket(
      @Valid @RequestBody SupportRequest request) {
    ;
    return ResponseEntity.ok(ApiResponse.ok(supportService.createSupportTicket(request)));
  }

  @PutMapping("/process/{id}")
  private ResponseEntity<ApiResponse<Void>> processSupportTicket(
      @PathVariable("id") Long id, @Valid @RequestBody ProcessSupportRequest request) {
    supportService.processSupportTickets(id, request);
    return ResponseEntity.ok(ApiResponse.ok(null));
  }

  @PatchMapping("/close/{id}")
  private ResponseEntity<ApiResponse<Void>> closeSupportTicket(@PathVariable("id") Long id) {
    supportService.closeSupportTicket(id);
    return ResponseEntity.ok(ApiResponse.ok(null));
  }
}
