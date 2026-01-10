package com.phongdnh.se121.repositories.support;

import com.phongdnh.se121.entities.support.SupportTicket;
import com.phongdnh.se121.projections.SupportTicketProjection;
import com.phongdnh.se121.repositories.SimpleRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface SupportTicketRepository extends SimpleRepository<SupportTicket, Long> {
  @Query(
      "SELECT "
          + "SUM(CASE WHEN b.status = 'OPEN' THEN 1 ELSE 0 END) AS numberOfOpenTickets, "
          + "SUM(CASE WHEN b.status = 'RESOLVED' THEN 1 ELSE 0 END) AS numberOfResolvedTickets, "
          + "SUM(CASE WHEN b.status = 'CLOSED' THEN 1 ELSE 0 END) AS numberOfClosedTickets "
          + "FROM SupportTicket b")
  SupportTicketProjection getSupportTicketStatistics();
}
