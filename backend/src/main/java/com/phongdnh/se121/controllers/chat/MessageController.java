package com.phongdnh.se121.controllers.chat;

import com.phongdnh.se121.dtos.ApiResponse;
import com.phongdnh.se121.dtos.PageResponse;
import com.phongdnh.se121.dtos.chat.MessageResponse;
import com.phongdnh.se121.entities.chat.Message;
import com.phongdnh.se121.services.chat.MessageService;
import io.github.perplexhub.rsql.RSQLJPASupport;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Chat Message")
@RequestMapping("/chat")
@RequiredArgsConstructor
@RestController
public class MessageController {
  private final MessageService messageService;

  @GetMapping("/conversations/{conversationId}/messages/manager")
  public ResponseEntity<ApiResponse<PageResponse<MessageResponse>>>
      getMessagesByConversationIdForManager(
          @PathVariable("conversationId") Long conversationId,
          @ParameterObject Pageable pageable,
          @RequestParam(value = "filter", required = false) String filter,
          @RequestParam(value = "all", required = false) boolean all) {
    if (all) {
      pageable = Pageable.unpaged(pageable.getSort());
    }
    Specification<Message> spec = RSQLJPASupport.toSpecification(filter);
    return ResponseEntity.ok(
        ApiResponse.ok(
            messageService.getMessagesByConversationIdForManager(conversationId, pageable, spec)));
  }

  @GetMapping("/conversations/{conversationId}/messages")
  public ResponseEntity<ApiResponse<PageResponse<MessageResponse>>> getMessagesByConversationId(
      @PathVariable("conversationId") Long conversationId,
      @ParameterObject Pageable pageable,
      @RequestParam(value = "filter", required = false) String filter,
      @RequestParam(value = "all", required = false) boolean all) {
    if (all) {
      pageable = Pageable.unpaged(pageable.getSort());
    }
    Specification<Message> spec = RSQLJPASupport.toSpecification(filter);
    return ResponseEntity.ok(
        ApiResponse.ok(messageService.getMessagesByConversationId(conversationId, pageable, spec)));
  }

  @DeleteMapping("/messages/{messageId}")
  public ResponseEntity<ApiResponse<Void>> deleteMessageById(
      @PathVariable("messageId") Long messageId) {
    messageService.deleteMessage(messageId);
    return ResponseEntity.ok(ApiResponse.ok(null));
  }
}
