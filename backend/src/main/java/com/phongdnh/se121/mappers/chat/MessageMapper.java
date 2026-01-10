package com.phongdnh.se121.mappers.chat;

import com.phongdnh.se121.dtos.chat.MessageResponse;
import com.phongdnh.se121.dtos.general.FileResponse;
import com.phongdnh.se121.entities.chat.ChatAttachment;
import com.phongdnh.se121.entities.chat.Message;
import com.phongdnh.se121.entities.general.File;
import com.phongdnh.se121.mappers.authentication.UserMapper;
import com.phongdnh.se121.mappers.general.FileMapper;
import java.util.List;
import java.util.stream.Collectors;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.ReportingPolicy;

@Mapper(
    componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.IGNORE,
    uses = {UserMapper.class, FileMapper.class})
public interface MessageMapper {
  @Mapping(target = "attachments", source = "attachments", qualifiedByName = "mapAttachments")
  MessageResponse entityToResponse(Message message);

  @Named("mapAttachments")
  default List<FileResponse> mapAttachments(List<ChatAttachment> attachments) {
    if (attachments == null) {
      return null;
    }
    return attachments.stream()
        .map(ChatAttachment::getAttachment)
        .map(this::mapFile)
        .collect(Collectors.toList());
  }

  FileResponse mapFile(File file);
}
