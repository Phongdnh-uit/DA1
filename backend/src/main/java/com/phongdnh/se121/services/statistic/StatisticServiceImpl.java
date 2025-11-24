package com.phongdnh.se121.services.statistic;

import com.phongdnh.se121.dtos.statistic.CountMetric;
import com.phongdnh.se121.dtos.statistic.DataPoint;
import com.phongdnh.se121.dtos.statistic.StatisticResponse;
import com.phongdnh.se121.enums.chat.ConversationStatus;
import com.phongdnh.se121.enums.statistic.Granularity;
import com.phongdnh.se121.repositories.authentication.UserRepository;
import com.phongdnh.se121.repositories.chat.ConversationRepository;
import com.phongdnh.se121.repositories.property.PropertyRepository;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class StatisticServiceImpl implements StatisticService {
  private final UserRepository userRepository;
  private final PropertyRepository propertyRepository;
  private final ConversationRepository conversationRepository;

  @Override
  public StatisticResponse getStatistics(
      Instant startDate, Instant endDate, Granularity granularity) {
    StatisticResponse response = new StatisticResponse();
    if (startDate == null) {
      startDate = Instant.EPOCH;
    }
    if (endDate == null) {
      endDate = Instant.now();
    }
    Long previousPeriodCount =
        ((endDate.getEpochSecond() - startDate.getEpochSecond()) / 86400L) + 1L;

    // property statistics
    response.setTotalProperties(
        calculatePropertyMetric(startDate, endDate, previousPeriodCount, granularity));

    // user statistics
    response.setTotalUsers(
        calculateUserMetric(startDate, endDate, previousPeriodCount, granularity));

    // pending conversation statistics
    response.setPendingConversations(
        calculatePendingConversationMetric(startDate, endDate, previousPeriodCount, granularity));
    return response;
  }

  private CountMetric calculatePendingConversationMetric(
      Instant startDate, Instant endDate, Long previousPeriodCount, Granularity granularity) {
    // total conversations
    Long totalConversations =
        conversationRepository.count(
            (root, _, builder) -> builder.equal(root.get("status"), ConversationStatus.PENDING));

    // compare current period vs previous period
    Long currentConversationsPeriod =
        conversationRepository.count(
            (root, _, builder) -> builder.between(root.get("createdAt"), startDate, endDate));
    Long previousConversationsPeriod =
        conversationRepository.count(
            (root, _, builder) ->
                builder.between(
                    root.get("createdAt"),
                    startDate.minusSeconds(previousPeriodCount * 86400L),
                    endDate.minusSeconds(previousPeriodCount * 86400L)));
    Double conversationGrowthRate =
        calculateGrowthRate(currentConversationsPeriod, previousConversationsPeriod);
    // get list of datapoints in current period
    List<Object[]> rawData =
        conversationRepository.countConversationsGroupedByCreatedAtBetween(
            startDate, endDate, granularity.name());
    List<DataPoint<String, Long>> dataPoints = mapToDataPoints(rawData, String.class, Long.class);
    CountMetric conversationMetric = new CountMetric();
    conversationMetric.setCurrentCount(totalConversations);
    conversationMetric.setPercentageChange(conversationGrowthRate);
    conversationMetric.setDataPoints(dataPoints);
    return conversationMetric;
  }

  private CountMetric calculateUserMetric(
      Instant startDate, Instant endDate, Long previousPeriodCount, Granularity granularity) {
    // total users
    Long totalUsers = userRepository.count();

    // compare current period vs previous period
    Long currentUsersPeriod =
        userRepository.count(
            (root, _, builder) -> builder.between(root.get("createdAt"), startDate, endDate));
    Long previousUsersPeriod =
        userRepository.count(
            (root, _, builder) ->
                builder.between(
                    root.get("createdAt"),
                    startDate.minusSeconds(previousPeriodCount * 86400L),
                    endDate.minusSeconds(previousPeriodCount * 86400L)));
    Double userGrowthRate = calculateGrowthRate(currentUsersPeriod, previousUsersPeriod);
    // get list of datapoints in current period
    List<Object[]> rawData =
        userRepository.countUsersGroupedByCreatedAtBetween(startDate, endDate, granularity.name());
    List<DataPoint<String, Long>> dataPoints = mapToDataPoints(rawData, String.class, Long.class);
    CountMetric userMetric = new CountMetric();
    userMetric.setCurrentCount(totalUsers);
    userMetric.setPercentageChange(userGrowthRate);
    userMetric.setDataPoints(dataPoints);
    return userMetric;
  }

  private CountMetric calculatePropertyMetric(
      Instant startDate, Instant endDate, Long previousPeriodCount, Granularity granularity) {
    // total properties
    Long totalProperties = propertyRepository.count();

    // compare current period vs previous period
    Long currentPropertiesPeriod =
        propertyRepository.count(
            (root, _, builder) -> builder.between(root.get("createdAt"), startDate, endDate));
    Long previousPropertiesPeriod =
        propertyRepository.count(
            (root, _, builder) ->
                builder.between(
                    root.get("createdAt"),
                    startDate.minusSeconds(previousPeriodCount * 86400L),
                    endDate.minusSeconds(previousPeriodCount * 86400L)));
    Double propertyGrowthRate =
        calculateGrowthRate(currentPropertiesPeriod, previousPropertiesPeriod);

    // get list of datapoints in current period
    List<Object[]> rawData =
        propertyRepository.countPropertiesGroupedByCreatedAtBetween(
            startDate, endDate, granularity.name());
    List<DataPoint<String, Long>> dataPoints = mapToDataPoints(rawData, String.class, Long.class);
    CountMetric propertyMetric = new CountMetric();
    propertyMetric.setCurrentCount(totalProperties);
    propertyMetric.setPercentageChange(propertyGrowthRate);
    propertyMetric.setDataPoints(dataPoints);
    return propertyMetric;
  }

  private Double calculateGrowthRate(Long currentCount, Long previousCount) {
    if (previousCount == 0L) {
      return currentCount == 0L ? 0.0 : 100.0;
    }
    return ((currentCount.doubleValue() - previousCount.doubleValue())
            / previousCount.doubleValue())
        * 100.0;
  }

  private <K, V> List<DataPoint<K, V>> mapToDataPoints(
      List<Object[]> rawData, Class<K> keyClass, Class<V> valueClass) {
    List<DataPoint<K, V>> dataPoints = new ArrayList<>();
    for (Object[] record : rawData) {
      K label = keyClass.cast(record[0]);
      V value = valueClass.cast(record[1]);
      dataPoints.add(new DataPoint<>(label, value));
    }
    return dataPoints;
  }
}
