package com.phongdnh.se121.mappers.chat;

import com.phongdnh.se121.dtos.chat.ConversationResponse;
import com.phongdnh.se121.entities.chat.Conversation;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(
    componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.IGNORE,
    uses = {ParticipantMapper.class})
public interface ConversationMapper {
  ConversationResponse entityToResponse(Conversation conversation);
}
