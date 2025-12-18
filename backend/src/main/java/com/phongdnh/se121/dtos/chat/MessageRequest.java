package com.phongdnh.se121.dtos.chat;

import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MessageRequest {
  private String content;
  private List<Long> attachmentIds;
}
