package com.phongdnh.se121.repositories.support;

import com.phongdnh.se121.entities.support.SupportTicket;
import com.phongdnh.se121.repositories.SimpleRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SupportTicketRepository extends SimpleRepository<SupportTicket, Long> {}
