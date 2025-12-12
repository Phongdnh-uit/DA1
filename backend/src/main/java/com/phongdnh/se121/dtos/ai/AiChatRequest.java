package com.phongdnh.se121.dtos.ai;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AiChatRequest {
  private String message;
  private String conversationId;
}
