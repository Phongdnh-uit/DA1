package com.phongdnh.se121.entities.chat;

import com.phongdnh.se121.entities.BaseEntity;
import com.phongdnh.se121.entities.general.File;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "chat_attachments")
public class ChatAttachment extends BaseEntity {
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "message_id", nullable = false)
  private Message message;

  // Use service to handle delete file, use async to ensure transational consistency between minIO
  // and database
  @OneToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "attachment_id", nullable = false)
  private File attachment;
}
