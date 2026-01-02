package com.phongdnh.se121.services.general;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.phongdnh.se121.dtos.general.SMSRequest;
import com.phongdnh.se121.exceptions.errors.ApiException;
import com.phongdnh.se121.exceptions.errors.ErrorCode;
import com.phongdnh.se121.utils.ValidationUtil;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class SpeedSMSService implements SMSService {
  private final SpeedSMSAPI speedSMSAPI;
  private final ObjectMapper objectMapper;

  @Async
  @Override
  public void sendSMS(SMSRequest smsRequest) {
    // validate phone number format
    boolean isPhoneValid = ValidationUtil.isValidPhoneNumber(smsRequest.getPhoneNumber(), "VN");
    if (!isPhoneValid) {
      throw new ApiException(ErrorCode.INVALID_PHONE_NUMBER);
    }
    int type = 4; // Đầu số ngẫu nhiên, chưa đăng ký brandname
    String brandname = ""; // Không sử dụng brandname
    String phoneFormat = ValidationUtil.formatPhoneToE164(smsRequest.getPhoneNumber(), "VN");
    phoneFormat = phoneFormat.substring(1);
    String response =
        speedSMSAPI.sendSMS(phoneFormat, smsRequest.getMessage(), type, brandname);
    try {
      Map<String, Object> responseMap = objectMapper.readValue(response, new TypeReference<>() {});
      if ("success".equals(responseMap.get("status"))) {
        log.info("SMS sent successfully to {} via SpeedSMS", smsRequest.getPhoneNumber());
      } else {
        log.error("Failed to send SMS via SpeedSMS: {}", response);
        throw new ApiException(ErrorCode.SMS_SENDING_FAILED);
      }
    } catch (JsonProcessingException e) {
      log.error("Failed to parse SpeedSMS response: {}", response, e);
      throw new ApiException(ErrorCode.SMS_SENDING_FAILED);
    }
  }

  @Override
  public String getProviderName() {
    return "SpeedSMS";
  }
}
