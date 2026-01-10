package com.phongdnh.se121.services.chat;

import com.phongdnh.se121.constants.ErrorMessageConstants;
import com.phongdnh.se121.dtos.PageResponse;
import com.phongdnh.se121.dtos.chat.MessageRequest;
import com.phongdnh.se121.dtos.chat.MessageResponse;
import com.phongdnh.se121.entities.chat.ChatAttachment;
import com.phongdnh.se121.entities.chat.Conversation;
import com.phongdnh.se121.entities.chat.ConversationParticipant;
import com.phongdnh.se121.entities.chat.Message;
import com.phongdnh.se121.entities.general.File;
import com.phongdnh.se121.enums.chat.ConversationStatus;
import com.phongdnh.se121.enums.general.FilePurpose;
import com.phongdnh.se121.enums.general.FileUsageStatus;
import com.phongdnh.se121.exceptions.errors.ApiException;
import com.phongdnh.se121.exceptions.errors.ErrorCode;
import com.phongdnh.se121.mappers.chat.MessageMapper;
import com.phongdnh.se121.repositories.chat.ConversationParticipantRepository;
import com.phongdnh.se121.repositories.chat.ConversationRepository;
import com.phongdnh.se121.repositories.chat.MessageRepository;
import com.phongdnh.se121.repositories.general.FileRepository;
import com.phongdnh.se121.securities.SecurityUtil;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Service
public class MessageServiceImpl implements MessageService {
  private final MessageRepository messageRepository;
  private final ConversationRepository conversationRepository;
  private final ConversationParticipantRepository conversationParticipantRepository;
  private final MessageMapper messageMapper;
  private final SimpMessagingTemplate simpleMessagingTemplate;
  private final FileRepository fileRepository;

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
  @Transactional
  public void sendMessage(Long conversationId, Long userId, MessageRequest request) {
    // Validate conversation
    Conversation conversation =
        conversationRepository
            .findById(conversationId)
            .orElseThrow(() -> new ApiException(ErrorCode.RESOURCE_NOT_FOUND));
    if (conversation.getStatus() != ConversationStatus.OPEN) {
      throw new ApiException(
          ErrorCode.VALIDATION_ERROR, Map.of("status", "Conversation is not in OPEN state"));
    }

    // Validate participant
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

    // Create and save message
    Message message = new Message();
    message.setSender(participant.getUser());
    message.setContent(request.getContent());
    message.setConversation(conversation);

    // Handle attached files if any
    if (request.getAttachmentIds() != null && !request.getAttachmentIds().isEmpty()) {
      List<File> attachments =
          fileRepository.findAll(
              (root, _, builder) ->
                  builder.and(
                      root.get("id").in(request.getAttachmentIds()),
                      builder.equal(root.get("createdBy"), userId),
                      builder.equal(root.get("purpose"), FilePurpose.CHAT_FILE)));
      // Validate all attachments are found
      if (attachments.size() != request.getAttachmentIds().size()) {
        throw new ApiException(
            ErrorCode.VALIDATION_ERROR,
            Map.of("attachments", "One or more attachments are invalid"));
      }
      // Mark files as used
      attachments.stream().forEach(file -> file.setUsageStatus(FileUsageStatus.IN_USE));

      List<ChatAttachment> chatAttachments =
          attachments.stream()
              .map(
                  file -> {
                    ChatAttachment chatAttachment = new ChatAttachment();
                    chatAttachment.setAttachment(file);
                    chatAttachment.setMessage(message);
                    return chatAttachment;
                  })
              .toList();
      message.setAttachments(chatAttachments);
      fileRepository.saveAll(attachments);
    }
    var entity = messageRepository.save(message);
    conversation.setLastMessageAt(Instant.now());
    conversationRepository.save(conversation);
    MessageResponse response = messageMapper.entityToResponse(entity);
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
          ErrorCode.FORBIDDEN, Map.of("sender", ErrorMessageConstants.AUTH_USER_NOT_MESSAGE_SENDER));
    }
    // Delete attachments if any
    if (message.getAttachments() != null && !message.getAttachments().isEmpty()) {
      var attachments =
          message.getAttachments().stream().map(ChatAttachment::getAttachment).toList();
      attachments.stream().forEach(file -> file.setUsageStatus(FileUsageStatus.NOT_IN_USE));
      fileRepository.saveAll(attachments);
    }

    messageRepository.delete(message);
  }
}
