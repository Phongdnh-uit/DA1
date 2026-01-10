package com.phongdnh.se121.entities.support;

import com.phongdnh.se121.entities.BaseEntity;
import com.phongdnh.se121.enums.support.SupportTicketSeverity;
import com.phongdnh.se121.enums.support.SupportTicketStatus;
import com.phongdnh.se121.enums.support.SupportTicketType;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "support_tickets")
public class SupportTicket extends BaseEntity {
  @Column(nullable = false)
  private String title;

  private String description;

  @Column(nullable = false)
  @Enumerated(EnumType.STRING)
  private SupportTicketType type;

  @Column(nullable = false)
  @Enumerated(EnumType.STRING)
  private SupportTicketSeverity severity;

  // Snapshot user
  private Long userId;
  private String userEmail;
  private String userName;

  // Admin manage
  @Column(nullable = false)
  @Enumerated(EnumType.STRING)
  private SupportTicketStatus status;

  private String note; // Internal note for admins
  private String reply; // Reply to user

  @OneToMany(
      mappedBy = "supportTicket",
      cascade = CascadeType.ALL,
      orphanRemoval = true,
      fetch = FetchType.LAZY)
  private List<SupportAttachment> attachments = new ArrayList<>();
}
