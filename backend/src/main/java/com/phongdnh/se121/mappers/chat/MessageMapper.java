package com.phongdnh.se121.mappers.chat;

import com.phongdnh.se121.dtos.chat.MessageResponse;
import com.phongdnh.se121.entities.chat.Message;
import com.phongdnh.se121.mappers.authentication.UserMapper;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(
    componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.IGNORE,
    uses = {UserMapper.class})
public interface MessageMapper {
  MessageResponse entityToResponse(Message message);
}
