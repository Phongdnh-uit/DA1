package com.phongdnh.se121.repositories.chat;

import com.phongdnh.se121.entities.chat.Message;
import com.phongdnh.se121.repositories.SimpleRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MessageRepository extends SimpleRepository<Message, Long> {}
