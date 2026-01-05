package com.phongdnh.se121.services.general;

import com.phongdnh.se121.dtos.general.SMSRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class TwilioSMSService implements SMSService {

  @Override
  public void sendSMS(SMSRequest smsRequest) {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'sendSMS'");
  }

  @Override
  public String getProviderName() {
    // TODO Auto-generated method stub
    throw new UnsupportedOperationException("Unimplemented method 'getProviderName'");
  }

  // @Value("${twilio.account-sid}")
  // private String accountSid;
  //
  // @Value("${twilio.auth-token}")
  // private String authToken;
  //
  // @Value("${twilio.from-phone}")
  // private String fromPhone;
  //
  // @PostConstruct
  // private void init() {
  //   // Initialize Twilio with account SID and auth token
  //   Twilio.init(accountSid, authToken);
  // }
  //
  // @Override
  // public void sendSMS(SMSRequest smsRequest) {
  //   String formatedPhoneNumber =
  //       ValidationUtil.formatPhoneToE164(smsRequest.getPhoneNumber(), "VN");
  //   Message message =
  //       Message.creator(
  //               new PhoneNumber(formatedPhoneNumber),
  //               new PhoneNumber(fromPhone),
  //               smsRequest.getMessage())
  //           .create();
  //   log.info("Sent SMS to {} with SID: {}", formatedPhoneNumber, message.getSid());
  // }
  //
  // @Override
  // public String getProviderName() {
  //   return "Twilio";
  // }
}
