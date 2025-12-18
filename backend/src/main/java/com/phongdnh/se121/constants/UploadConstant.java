package com.phongdnh.se121.constants;

import java.util.Map;

public interface UploadConstant {
  Long MAX_FILE_SIZE = 5L * 1024 * 1024; // 5 MB
  Map<String, byte[]> MAGIC_BYTES =
      Map.of(
          "PDF", new byte[] {0x25, 0x50, 0x44, 0x46}, // %PDF
          "PNG", new byte[] {(byte) 0x89, 0x50, 0x4E, 0x47},
          "JPG", new byte[] {(byte) 0xFF, (byte) 0xD8, (byte) 0xFF},
          "GIF", new byte[] {0x47, 0x49, 0x46, 0x38},
          "ZIP", new byte[] {0x50, 0x4B, 0x03, 0x04});
}
