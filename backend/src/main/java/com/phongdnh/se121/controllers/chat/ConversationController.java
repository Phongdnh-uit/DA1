package com.phongdnh.se121.controllers.chat;

import com.phongdnh.se121.dtos.ApiResponse;
import com.phongdnh.se121.dtos.PageResponse;
import com.phongdnh.se121.dtos.chat.ChatInitilizeRequest;
import com.phongdnh.se121.dtos.chat.ConversationResponse;
import com.phongdnh.se121.entities.chat.Conversation;
import com.phongdnh.se121.services.chat.ConversationService;
import io.github.perplexhub.rsql.RSQLJPASupport;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Conversation")
@RequestMapping("/chat/conversations")
@RequiredArgsConstructor
@RestController
public class ConversationController {
  private final ConversationService chatService;

  @GetMapping()
  public ResponseEntity<ApiResponse<PageResponse<ConversationResponse>>> findAllConversations(
      @ParameterObject Pageable pageable,
      @RequestParam(name = "filter", required = false) String filter,
      @RequestParam(name = "all", required = false) boolean all) {
    if (all) {
      pageable = Pageable.unpaged(pageable.getSort());
    }
    Specification<Conversation> spec = RSQLJPASupport.toSpecification(filter);
    return ResponseEntity.ok(ApiResponse.ok(chatService.getAllConversations(pageable, spec)));
  }

  @GetMapping("/{conversationId}")
  public ResponseEntity<ApiResponse<ConversationResponse>> getConversationById(
      @PathVariable("conversationId") Long conversationId) {
    return ResponseEntity.ok(ApiResponse.ok(chatService.getConversationById(conversationId)));
  }

  @GetMapping("/me")
  public ResponseEntity<ApiResponse<PageResponse<ConversationResponse>>>
      getCurrentUserConversations(
          @ParameterObject Pageable pageable,
          @RequestParam(name = "filter", required = false) String filter,
          @RequestParam(name = "all", required = false) boolean all) {
    if (all) {
      pageable = Pageable.unpaged(pageable.getSort());
    }
    Specification<Conversation> spec = RSQLJPASupport.toSpecification(filter);
    return ResponseEntity.ok(
        ApiResponse.ok(chatService.getCurrentUserConversations(pageable, spec)));
  }

  @PostMapping("/initialize")
  public ResponseEntity<ApiResponse<ConversationResponse>> initializeChat(
      @RequestBody ChatInitilizeRequest request) {
    return ResponseEntity.ok(ApiResponse.ok(chatService.initializeChat(request)));
  }

  @PostMapping("/{conversationId}/participate")
  public ResponseEntity<ApiResponse<Void>> participateInConversation(
      @PathVariable("conversationId") Long conversationId) {
    chatService.participateInConversation(conversationId);
    return ResponseEntity.ok(ApiResponse.ok(null));
  }

  @PostMapping("/{conversationId}/close")
  public ResponseEntity<ApiResponse<Void>> closeConversation(
      @PathVariable("conversationId") Long conversationId) {
    chatService.closeConversation(conversationId);
    return ResponseEntity.ok(ApiResponse.ok(null));
  }
}
