package com.phongdnh.se121.repositories.chat;

import com.phongdnh.se121.entities.chat.Conversation;
import com.phongdnh.se121.repositories.SimpleRepository;
import java.time.Instant;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ConversationRepository extends SimpleRepository<Conversation, Long> {

  @Query(
      value =
"""
    SELECT
        CASE
            WHEN :granularity = 'DAILY' THEN DATE_FORMAT(c.createdAt, '%d-%m-%Y')
            WHEN :granularity = 'WEEKLY' THEN DATE_FORMAT(c.createdAt, 'W%v-%x')
            WHEN :granularity = 'MONTHLY' THEN DATE_FORMAT(c.createdAt, '%m-%Y')
            WHEN :granularity = 'YEARLY' THEN DATE_FORMAT(c.createdAt, '%Y')
        END AS period,
        COUNT(c.id) AS conversationCount
    FROM Conversation c
    WHERE c.createdAt BETWEEN :startDate AND :endDate
    GROUP BY period
    ORDER BY period ASC
""")
  List<Object[]> countConversationsGroupedByCreatedAtBetween(
      @Param("startDate") Instant startDate,
      @Param("endDate") Instant endDate,
      @Param("granularity") String granularity);
}
