package com.phongdnh.se121.entities.chat;

import com.phongdnh.se121.entities.BaseEntity;
import com.phongdnh.se121.entities.authentication.User;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.Instant;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(
    name = "conversation_participants",
    uniqueConstraints = {@UniqueConstraint(columnNames = {"conversation_id", "user_id"})})
public class ConversationParticipant extends BaseEntity {
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "conversation_id")
  private Conversation conversation;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id")
  private User user;

  private Instant lastSeenAt;
}
