package com.phongdnh.se121.entities.chat;

import com.phongdnh.se121.entities.BaseEntity;
import com.phongdnh.se121.enums.chat.ConversationStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.List;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.DynamicUpdate;

@Getter
@Setter
@Entity
@DynamicUpdate
@Table(name = "conversations")
public class Conversation extends BaseEntity {
  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private ConversationStatus status;

  private Long contextId;

  private Instant lastMessageAt;

  @OneToMany(mappedBy = "conversation")
  private List<ConversationParticipant> participants;
}
