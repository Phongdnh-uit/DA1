package com.phongdnh.se121.services.chat;

import com.phongdnh.se121.dtos.PageResponse;
import com.phongdnh.se121.dtos.chat.MessageRequest;
import com.phongdnh.se121.dtos.chat.MessageResponse;
import com.phongdnh.se121.entities.chat.Message;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

public interface MessageService {

  PageResponse<MessageResponse> getMessagesByConversationIdForManager(
      Long conversationId, Pageable pageable, Specification<Message> spec);

  PageResponse<MessageResponse> getMessagesByConversationId(
      Long conversationId, Pageable pageable, Specification<Message> spec);

  void sendMessage(Long conversationId, Long userId, MessageRequest request);

  void deleteMessage(Long messageId);
}
