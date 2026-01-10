package com.phongdnh.se121.dtos.support;

import com.phongdnh.se121.entities.BaseEntity;
import com.phongdnh.se121.enums.support.SupportTicketSeverity;
import com.phongdnh.se121.enums.support.SupportTicketStatus;
import com.phongdnh.se121.enums.support.SupportTicketType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SummarySupportResponse extends BaseEntity {
  private String title;

  private SupportTicketType type;

  private SupportTicketSeverity severity;

  // Admin manage
  private SupportTicketStatus status;
}
