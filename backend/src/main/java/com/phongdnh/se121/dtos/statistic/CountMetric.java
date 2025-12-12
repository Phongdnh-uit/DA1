package com.phongdnh.se121.dtos.statistic;

import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CountMetric {
  private Long currentCount;
  private Double percentageChange;
  List<DataPoint<String, Long>> dataPoints;
}
