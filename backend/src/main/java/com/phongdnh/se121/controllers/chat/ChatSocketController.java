package com.phongdnh.se121.controllers.chat;

import com.cloudinary.api.exceptions.ApiException;
import com.phongdnh.se121.dtos.ApiResponse;
import com.phongdnh.se121.dtos.chat.MessageRequest;
import com.phongdnh.se121.exceptions.errors.ErrorCode;
import com.phongdnh.se121.securities.CustomUserDetails;
import com.phongdnh.se121.services.chat.MessageService;
import java.security.Principal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Controller;

@RequiredArgsConstructor
@Controller
public class ChatSocketController {
  private final MessageService messageService;

  @MessageMapping("/conversations/{conversationId}/send-message")
  public ResponseEntity<ApiResponse<Void>> sendMessage(
      @DestinationVariable("conversationId") Long conversationId,
      @Payload MessageRequest request,
      Principal principal) {
    CustomUserDetails userDetails =
        (CustomUserDetails) ((UsernamePasswordAuthenticationToken) principal).getPrincipal();
    messageService.sendMessage(conversationId, userDetails.getId(), request);
    return ResponseEntity.ok(ApiResponse.ok(null));
  }

  @MessageExceptionHandler(ApiException.class)
  @SendToUser("/queue/errors")
  public ResponseEntity<ApiResponse<Void>> handleApiException(ApiException exception) {
    ApiResponse<Void> response = new ApiResponse<>();
    response.setCode(ErrorCode.INTERNAL_SERVER_ERROR.getCode());
    response.setMessage(exception.getMessage());
    return ResponseEntity.badRequest().body(response);
  }
}
