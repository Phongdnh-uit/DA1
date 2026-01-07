package com.phongdnh.se121.services.general;

import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.client.RestClient;

// @Service
@RequiredArgsConstructor
public class SpeedSMSAPI {

  @Qualifier("speedSMSRestClient")
  private final RestClient restClient;

  /**
   * Get user information
   *
   * @param: none
   * @return: json string
   */
  public String getUserInfo() throws IOException {
    return restClient.get().uri("/user/info").retrieve().body(String.class);
  }

  /**
   * Send SMS
   *
   * @param
   * @return: json string
   */
  public String sendSMS(String to, String content, int type, String sender) {
    String json =
        "{\"to\": [\""
            + to
            + "\"], \"content\": \""
            + EncodeNonAsciiCharacters(content)
            + "\", \"type\":"
            + type
            + ", \"brandname\":\""
            + sender
            + "\"}";
    return restClient.post().uri("/sms/send").body(json).retrieve().body(String.class);
  }

  private String EncodeNonAsciiCharacters(String value) {
    StringBuffer sb = new StringBuffer();
    for (int i = 0; i < value.length(); i++) {
      char c = value.charAt(i);
      int unit = (int) c;
      if (unit > 127) {
        String hex = String.format("%04x", (int) unit);
        String encodedValue = "\\u" + hex;
        sb.append(encodedValue);
      } else {
        sb.append(c);
      }
    }
    return sb.toString();
  }
}
