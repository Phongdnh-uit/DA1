package com.phongdnh.se121.services.general;

import com.phongdnh.se121.dtos.general.SMSRequest;

public interface SMSService {
  void sendSMS(SMSRequest smsRequest);

  String getProviderName();
}
