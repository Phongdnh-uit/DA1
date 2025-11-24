package com.phongdnh.se121.dtos.statistic;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class DataPoint<K, V> {
  private K label;
  private V value;
}
