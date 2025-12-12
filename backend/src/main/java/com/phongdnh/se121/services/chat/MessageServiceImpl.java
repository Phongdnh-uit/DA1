package com.phongdnh.se121.services.chat;

import com.phongdnh.se121.dtos.PageResponse;
import com.phongdnh.se121.dtos.chat.MessageRequest;
import com.phongdnh.se121.dtos.chat.MessageResponse;
import com.phongdnh.se121.entities.chat.Conversation;
import com.phongdnh.se121.entities.chat.ConversationParticipant;
import com.phongdnh.se121.entities.chat.Message;
import com.phongdnh.se121.enums.chat.ConversationStatus;
import com.phongdnh.se121.exceptions.errors.ApiException;
import com.phongdnh.se121.exceptions.errors.ErrorCode;
import com.phongdnh.se121.mappers.chat.MessageMapper;
import com.phongdnh.se121.repositories.chat.ConversationParticipantRepository;
import com.phongdnh.se121.repositories.chat.ConversationRepository;
import com.phongdnh.se121.repositories.chat.MessageRepository;
import com.phongdnh.se121.securities.SecurityUtil;
import java.time.Instant;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class MessageServiceImpl implements MessageService {
  private final MessageRepository messageRepository;
  private final ConversationRepository conversationRepository;
  private final ConversationParticipantRepository conversationParticipantRepository;
  private final MessageMapper messageMapper;
  private final SimpMessagingTemplate simpleMessagingTemplate;

  @Override
  public PageResponse<MessageResponse> getMessagesByConversationIdForManager(
      Long conversationId, Pageable pageable, Specification<Message> spec) {
    Specification<Message> conversationSpec =
        (root, _, builder) -> builder.equal(root.get("conversation").get("id"), conversationId);
    Specification<Message> finalSpec = spec.and(conversationSpec);
    var page = messageRepository.findAll(finalSpec, pageable);
    return PageResponse.fromPage(page.map(messageMapper::entityToResponse));
  }

  @Override
  public PageResponse<MessageResponse> getMessagesByConversationId(
      Long conversationId, Pageable pageable, Specification<Message> spec) {
    Long userId = SecurityUtil.getCurrentUserId();
    if (!conversationParticipantRepository.exists(
        (root, _, builder) ->
            builder.and(
                builder.equal(root.get("user").get("id"), userId),
                builder.equal(root.get("conversation").get("id"), conversationId)))) {
      throw new ApiException(
          ErrorCode.FORBIDDEN,
          Map.of("participant", "User is not a participant in this conversation"));
    }
    Specification<Message> conversationSpec =
        (root, _, builder) -> builder.equal(root.get("conversation").get("id"), conversationId);
    Specification<Message> finalSpec = spec.and(conversationSpec);
    var page = messageRepository.findAll(finalSpec, pageable);
    return PageResponse.fromPage(page.map(messageMapper::entityToResponse));
  }

  @Override
  public void sendMessage(Long conversationId, Long userId, MessageRequest request) {
    Conversation conversation =
        conversationRepository
            .findById(conversationId)
            .orElseThrow(() -> new ApiException(ErrorCode.RESOURCE_NOT_FOUND));
    if (conversation.getStatus() != ConversationStatus.OPEN) {
      throw new ApiException(
          ErrorCode.VALIDATION_ERROR, Map.of("status", "Conversation is not in OPEN state"));
    }
    ConversationParticipant participant =
        conversationParticipantRepository
            .findOne(
                (root, _, builder) ->
                    builder.and(
                        builder.equal(root.get("user").get("id"), userId),
                        builder.equal(root.get("conversation").get("id"), conversationId)))
            .orElseThrow(
                () ->
                    new ApiException(
                        ErrorCode.FORBIDDEN,
                        Map.of("participant", "User is not a participant in this conversation")));
    participant.getUser().getId();
    Message message = new Message();
    message.setSender(participant.getUser());
    message.setContent(request.getContent());
    message.setConversation(conversation);
    message = messageRepository.save(message);
    conversation.setLastMessageAt(Instant.now());
    conversationRepository.save(conversation);
    MessageResponse response = messageMapper.entityToResponse(message);
    simpleMessagingTemplate.convertAndSend("/topic/conversations/" + conversationId, response);
  }

  @Override
  public void deleteMessage(Long messageId) {
    Long userId = SecurityUtil.getCurrentUserId();
    Message message =
        messageRepository
            .findById(messageId)
            .orElseThrow(() -> new ApiException(ErrorCode.RESOURCE_NOT_FOUND));
    if (!message.getSender().getId().equals(userId)) {
      throw new ApiException(
          ErrorCode.FORBIDDEN, Map.of("sender", "User is not the sender of this message"));
    }
    messageRepository.delete(message);
  }
}
