package com.phongdnh.se121.services.chat;

import com.phongdnh.se121.constants.ChatConstant;
import com.phongdnh.se121.constants.ErrorMessageConstants;
import com.phongdnh.se121.dtos.PageResponse;
import com.phongdnh.se121.dtos.chat.ChatInitilizeRequest;
import com.phongdnh.se121.dtos.chat.ConversationResponse;
import com.phongdnh.se121.entities.chat.Conversation;
import com.phongdnh.se121.entities.chat.ConversationParticipant;
import com.phongdnh.se121.entities.chat.Message;
import com.phongdnh.se121.enums.chat.ConversationStatus;
import com.phongdnh.se121.exceptions.errors.ApiException;
import com.phongdnh.se121.exceptions.errors.ErrorCode;
import com.phongdnh.se121.mappers.chat.ConversationMapper;
import com.phongdnh.se121.repositories.authentication.UserRepository;
import com.phongdnh.se121.repositories.chat.ConversationParticipantRepository;
import com.phongdnh.se121.repositories.chat.ConversationRepository;
import com.phongdnh.se121.repositories.chat.MessageRepository;
import com.phongdnh.se121.securities.SecurityUtil;
import jakarta.transaction.Transactional;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class ConversationServiceImpl implements ConversationService {
  private final ConversationRepository conversationRepository;
  private final ConversationParticipantRepository conversationParticipantRepository;
  private final ConversationMapper conversationMapper;
  private final MessageRepository messageRepository;
  private final UserRepository userRepository;

  @Override
  public PageResponse<ConversationResponse> getAllConversations(
      Pageable pageable, Specification<Conversation> spec) {
    var page = conversationRepository.findAll(spec, pageable);
    return PageResponse.fromPage(page.map(conversationMapper::entityToResponse));
  }

  @Override
  public ConversationResponse getConversationById(Long conversationId) {
    Conversation conversation =
        conversationRepository
            .findById(conversationId)
            .orElseThrow(() -> new ApiException(ErrorCode.RESOURCE_NOT_FOUND));
    return conversationMapper.entityToResponse(conversation);
  }

  @Transactional
  @Override
  public ConversationResponse initializeChat(ChatInitilizeRequest request) {
    Long userId = SecurityUtil.getCurrentUserId();
    // Check if there is an existing OPEN or PENDING conversation for the user, check if has current
    // but context is null also create new
    Specification<ConversationParticipant> spec =
        (root, _, builder) ->
            builder.and(
                builder.equal(root.get("user").get("id"), userId),
                builder.or(
                    builder.equal(root.get("conversation").get("status"), ConversationStatus.OPEN),
                    builder.equal(
                        root.get("conversation").get("status"), ConversationStatus.PENDING)));
    if (request.getContextId() != null) {
      spec =
          spec.and(
              (root, _, builder) ->
                  builder.equal(root.get("conversation").get("contextId"), request.getContextId()));
    }
    List<ConversationParticipant> participants =
        conversationParticipantRepository.findAll(spec);
    if (participants.size() > 0) {
      return conversationMapper.entityToResponse(participants.get(0).getConversation());
    }
    Conversation conversation = new Conversation();
    conversation.setStatus(ConversationStatus.PENDING);
    conversation.setContextId(request.getContextId());
    conversation.setLastMessageAt(Instant.now());
    conversation = conversationRepository.save(conversation);

    ConversationParticipant participant = new ConversationParticipant();
    participant.setUser(userRepository.getReferenceById(userId));
    participant.setConversation(conversation);
    conversationParticipantRepository.save(participant);

    Message message = new Message();
    message.setConversation(conversation);
    message.setSender(userRepository.getReferenceById(userId));
    message.setContent(ChatConstant.DEFAULT_CHAT_INIT);
    messageRepository.save(message);
    return conversationMapper.entityToResponse(conversation);
  }

  @Override
  public PageResponse<ConversationResponse> getCurrentUserConversations(
      Pageable pageable, Specification<Conversation> spec) {
    Long userId = SecurityUtil.getCurrentUserId();
    Specification<Conversation> userSpec =
        (root, _, builder) ->
            builder.equal(root.join("participants").get("user").get("id"), userId);
    userSpec = userSpec.and(spec);
    var page = conversationRepository.findAll(userSpec, pageable);
    return PageResponse.fromPage(page.map(conversationMapper::entityToResponse));
  }

  @Override
  public void participateInConversation(Long conversationId) {
    Long userId = SecurityUtil.getCurrentUserId();
    Conversation conversation =
        conversationRepository
            .findById(conversationId)
            .orElseThrow(() -> new ApiException(ErrorCode.RESOURCE_NOT_FOUND));
    if (conversation.getStatus() != ConversationStatus.PENDING) {
      throw new ApiException(
          ErrorCode.VALIDATION_ERROR, Map.of("status", "Conversation is not in PENDING state"));
    }
    Optional<ConversationParticipant> participant =
        conversationParticipantRepository.findOne(
            (root, _, builder) ->
                builder.and(
                    builder.equal(root.get("user").get("id"), userId),
                    builder.equal(root.get("conversation").get("id"), conversationId)));
    if (!participant.isEmpty()) {
      throw new ApiException(
          ErrorCode.VALIDATION_ERROR,
          Map.of("participant", ErrorMessageConstants.AUTH_USER_ALREADY_PARTICIPANT));
    }
    ConversationParticipant newParticipant = new ConversationParticipant();
    newParticipant.setUser(userRepository.getReferenceById(userId));
    newParticipant.setConversation(conversation);
    conversationParticipantRepository.save(newParticipant);
    conversation.setStatus(ConversationStatus.OPEN);
    conversationRepository.save(conversation);
  }

  @Override
  public void closeConversation(Long conversationId) {
    Conversation conversation =
        conversationRepository
            .findById(conversationId)
            .orElseThrow(() -> new ApiException(ErrorCode.RESOURCE_NOT_FOUND));
    conversation.setStatus(ConversationStatus.CLOSED);
    conversationRepository.save(conversation);
  }
}
