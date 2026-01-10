package com.phongdnh.se121.dtos.chat;

import com.phongdnh.se121.dtos.authentication.UserResponse;
import com.phongdnh.se121.dtos.general.FileResponse;
import com.phongdnh.se121.entities.BaseEntity;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MessageResponse extends BaseEntity {
  private UserResponse sender;

  private String content;

  private List<FileResponse> attachments;
}
