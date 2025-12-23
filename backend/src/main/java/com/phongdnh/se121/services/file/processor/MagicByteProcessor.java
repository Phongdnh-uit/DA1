package com.phongdnh.se121.services.file.processor;

import com.phongdnh.se121.constants.UploadConstant;
import com.phongdnh.se121.services.file.FileProcessor;
import java.io.InputStream;
import org.springframework.stereotype.Component;

@Component
public class MagicByteProcessor implements FileProcessor {

  @Override
  public boolean processFile(InputStream fileStream) {
    byte[] header = new byte[8];
    try {
      if (fileStream.read(header) < 4) {
        return false;
      }
      for (var entry : UploadConstant.MAGIC_BYTES.entrySet()) {
        byte[] magicBytes = entry.getValue();
        boolean match = true;
        for (int i = 0; i < magicBytes.length; i++) {
          if (header[i] != magicBytes[i]) {
            match = false;
            break;
          }
        }
        if (match) {
          return true;
        }
      }
      return false;
    } catch (Exception e) {
      return false;
    }
  }

  @Override
  public String getProcessorType() {
    return "MAGIC_BYTE";
  }
}
