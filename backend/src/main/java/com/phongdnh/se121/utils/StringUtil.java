package com.phongdnh.se121.utils;

import java.math.BigDecimal;

public class StringUtil {

  public static String formatPrice(BigDecimal price) {
    if (price == null) return "Không rõ";
    if (price.compareTo(BigDecimal.valueOf(1_000_000_000)) >= 0)
      return price.divide(BigDecimal.valueOf(1_000_000_000)) + " tỷ VNĐ";
    if (price.compareTo(BigDecimal.valueOf(1_000_000)) >= 0)
      return price.divide(BigDecimal.valueOf(1_000_000)) + " triệu VNĐ";
    return price + " VNĐ";
  }

  public static String formatArea(BigDecimal area) {
    return area == null ? null : area + " m²";
  }

  public static String safeNumber(Object value) {
    return value == null ? null : value.toString();
  }

  public static String capitalize(String s) {
    return (s == null || s.isEmpty()) ? "" : Character.toUpperCase(s.charAt(0)) + s.substring(1);
  }

  public static String formatWidth(Double width) {
    return width == null ? null : width + " m";
  }

  public static String safe(String s) {
    return s == null ? "" : s.trim();
  }
}
