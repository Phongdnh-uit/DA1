package com.phongdnh.se121.ai;

import java.util.Map;

public interface TextNormalizeService {
  String normalizeTitle(String title);

  Map<String, Object> extractUserQueryMetadata(String userQuery);
}
