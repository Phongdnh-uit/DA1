package com.phongdnh.se121.services.file;

import java.io.InputStream;

public interface FileProcessor {

  boolean processFile(InputStream fileStream);

  String getProcessorType();
}
