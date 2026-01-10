package com.phongdnh.se121.projections;

public interface SupportTicketProjection {
  Long getNumberOfOpenTickets();

  Long getNumberOfResolvedTickets();

  Long getNumberOfClosedTickets();
}
