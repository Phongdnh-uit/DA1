package com.phongdnh.se121.controllers.statistic;

import com.phongdnh.se121.dtos.ApiResponse;
import com.phongdnh.se121.dtos.statistic.StatisticResponse;
import com.phongdnh.se121.enums.statistic.Granularity;
import com.phongdnh.se121.services.statistic.StatisticService;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.time.Instant;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Statistic")
@RequiredArgsConstructor
@RequestMapping("/statistics")
@RestController
public class StatisticController {
  private final StatisticService statisticService;

  @GetMapping()
  public ResponseEntity<ApiResponse<StatisticResponse>> getStatistics(
      @RequestParam(value = "startDate", required = false) Instant startDate,
      @RequestParam(value = "endDate", required = false) Instant endDate,
      @RequestParam(value = "granularity", required = false, defaultValue = "DAILY")
          Granularity granularity) {
    return ResponseEntity.ok(
        ApiResponse.ok(statisticService.getStatistics(startDate, endDate, granularity)));
  }
}
