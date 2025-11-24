package com.phongdnh.se121.dtos.chat;

import com.phongdnh.se121.entities.BaseEntity;
import com.phongdnh.se121.enums.chat.ConversationStatus;
import java.time.Instant;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ConversationResponse extends BaseEntity {
  private Long contextId;
  private ConversationStatus status;
  private Instant lastMessageAt;
  private List<ParticipantResponse> participants;
}
