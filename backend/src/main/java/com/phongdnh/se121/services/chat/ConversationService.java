package com.phongdnh.se121.services.chat;

import com.phongdnh.se121.dtos.PageResponse;
import com.phongdnh.se121.dtos.chat.ChatInitilizeRequest;
import com.phongdnh.se121.dtos.chat.ConversationResponse;
import com.phongdnh.se121.entities.chat.Conversation;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

public interface ConversationService {
  ConversationResponse initializeChat(ChatInitilizeRequest request);

  PageResponse<ConversationResponse> getAllConversations(
      Pageable pageable, Specification<Conversation> spec);

  PageResponse<ConversationResponse> getCurrentUserConversations(
      Pageable pageable, Specification<Conversation> spec);

    ConversationResponse getConversationById(Long conversationId);

  void participateInConversation(Long conversationId);

  void closeConversation(Long conversationId);
}
