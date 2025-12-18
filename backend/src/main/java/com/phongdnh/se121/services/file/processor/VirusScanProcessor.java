package com.phongdnh.se121.services.file.processor;

import com.phongdnh.se121.services.file.FileProcessor;
import java.io.InputStream;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import xyz.capybara.clamav.ClamavClient;
import xyz.capybara.clamav.commands.scan.result.ScanResult;

@RequiredArgsConstructor
@Component
public class VirusScanProcessor implements FileProcessor {
  private final ClamavClient clamavClient;

  @Override
  public boolean processFile(InputStream fileStream) {
    ScanResult scanResult = clamavClient.scan(fileStream);
    if (scanResult instanceof ScanResult.VirusFound) {
      ((ScanResult.VirusFound) scanResult)
          .getFoundViruses()
          .forEach(
              (key, value) -> {
                System.out.println("Virus found: " + key + " - " + value);
              });
      return false;
    }
    return true;
  }

  @Override
  public String getProcessorType() {
    return "VIRUS_SCAN";
  }
}
