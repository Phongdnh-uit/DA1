package com.phongdnh.se121.dtos.support;

import com.phongdnh.se121.enums.support.SupportTicketSeverity;
import com.phongdnh.se121.enums.support.SupportTicketType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SupportRequest {
  @NotBlank private String title;

  private String description;

  @NotNull private SupportTicketType type;

  @NotNull private SupportTicketSeverity severity;

  private List<Long> attachmentIds;
}
