package com.phongdnh.se121.entities.support;

import com.phongdnh.se121.entities.BaseEntity;
import com.phongdnh.se121.entities.general.File;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "support_attachments")
public class SupportAttachment extends BaseEntity {
  @ManyToOne(fetch = jakarta.persistence.FetchType.LAZY)
  @JoinColumn(name = "support_ticket_id", nullable = false)
  private SupportTicket supportTicket;

  @OneToOne(fetch = jakarta.persistence.FetchType.LAZY)
  @JoinColumn(name = "file_id", nullable = false)
  private File file;
}
