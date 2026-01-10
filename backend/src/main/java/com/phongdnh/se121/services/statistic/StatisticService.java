package com.phongdnh.se121.services.statistic;

import com.phongdnh.se121.dtos.statistic.StatisticResponse;
import com.phongdnh.se121.enums.statistic.Granularity;
import java.time.Instant;

public interface StatisticService {
  StatisticResponse getStatistics(Instant startDate, Instant endDate, Granularity granularity);
}
