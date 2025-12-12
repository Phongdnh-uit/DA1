package com.phongdnh.se121.dtos.statistic;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StatisticResponse {
  private CountMetric totalProperties;
  private CountMetric totalUsers;
  private CountMetric pendingConversations;
}
