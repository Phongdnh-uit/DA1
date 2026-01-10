package com.phongdnh.se121.dtos.chat;

import com.phongdnh.se121.dtos.authentication.UserResponse;
import java.time.Instant;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ParticipantResponse {
  private UserResponse user;
  private Instant lastSeenAt;
}
