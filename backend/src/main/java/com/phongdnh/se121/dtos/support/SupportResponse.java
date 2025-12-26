package com.phongdnh.se121.dtos.support;

import com.phongdnh.se121.dtos.general.FileResponse;
import com.phongdnh.se121.entities.BaseEntity;
import com.phongdnh.se121.enums.support.SupportTicketSeverity;
import com.phongdnh.se121.enums.support.SupportTicketStatus;
import com.phongdnh.se121.enums.support.SupportTicketType;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SupportResponse extends BaseEntity {
  private String title;

  private String description;

  private SupportTicketType type;

  private SupportTicketSeverity severity;

  // Snapshot user
  private Long userId;
  private String userEmail;
  private String userName;

  // Admin manage
  private SupportTicketStatus status;

  private String reply;

  private List<FileResponse> attachments;
}
