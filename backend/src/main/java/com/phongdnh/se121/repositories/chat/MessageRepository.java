package com.phongdnh.se121.repositories.chat;

import com.phongdnh.se121.entities.chat.Message;
import com.phongdnh.se121.repositories.SimpleRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.stereotype.Repository;

@Repository
public interface MessageRepository extends SimpleRepository<Message, Long> {

  @EntityGraph(attributePaths = {"attachments", "attachments.attachment"})
  @Override
  Page<Message> findAll(Specification<Message> spec, Pageable pageable);
}
