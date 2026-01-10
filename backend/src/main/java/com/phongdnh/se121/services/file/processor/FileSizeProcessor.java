package com.phongdnh.se121.services.file.processor;

import com.phongdnh.se121.constants.UploadConstant;
import com.phongdnh.se121.services.file.FileProcessor;
import java.io.InputStream;
import org.springframework.stereotype.Component;

@Component
public class FileSizeProcessor implements FileProcessor {

  @Override
  public boolean processFile(InputStream fileStream) {
    long fileSize = 0;
    try {
      fileSize = fileStream.available();
      return fileSize > 0 && fileSize <= UploadConstant.MAX_FILE_SIZE;
    } catch (Exception e) {
      return false;
    }
  }

  @Override
  public String getProcessorType() {
    return "FILE_SIZE_CHECKER";
  }
}
