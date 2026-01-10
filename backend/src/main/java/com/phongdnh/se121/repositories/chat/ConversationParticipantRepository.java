package com.phongdnh.se121.repositories.chat;

import com.phongdnh.se121.entities.chat.ConversationParticipant;
import com.phongdnh.se121.repositories.SimpleRepository;
import java.util.Optional;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.stereotype.Repository;

@Repository
public interface ConversationParticipantRepository
    extends SimpleRepository<ConversationParticipant, Long> {

  @EntityGraph(attributePaths = {"conversation", "user", "user.avatar"})
  @Override
  Optional<ConversationParticipant> findOne(Specification<ConversationParticipant> spec);
}
