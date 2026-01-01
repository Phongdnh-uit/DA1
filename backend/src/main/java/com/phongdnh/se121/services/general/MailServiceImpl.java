package com.phongdnh.se121.services.general;

import com.phongdnh.se121.constants.AppConstant;
import com.phongdnh.se121.constants.ErrorMessageConstants;
import com.phongdnh.se121.exceptions.errors.ApiException;
import com.phongdnh.se121.exceptions.errors.ErrorCode;
import jakarta.mail.internet.MimeMessage;
import java.text.MessageFormat;
import java.util.HashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Slf4j
@RequiredArgsConstructor
@Service
public class MailServiceImpl implements MailService {
  private final JavaMailSender mailSender;
  private final TemplateEngine templateEngine;

  @Value("${spring.mail.sender-address}")
  private String senderAddress;

  /**
   * @param to : recipient of the email
   * @param subject : subject of the email
   * @param content : content of the email, can be HTML or plain text
   * @param isMultipart : if the email contains attachments
   * @param isHtml : if the email content is HTML
   */
  @Async
  public void sendEmail(
      String to, String subject, String content, boolean isMultipart, boolean isHtml) {

    MimeMessage message = mailSender.createMimeMessage();
    try {
      MimeMessageHelper helper = new MimeMessageHelper(message, isMultipart, "UTF-8");
      helper.setTo(to);
      helper.setFrom(senderAddress);
      helper.setSubject(subject);
      helper.setText(content, isHtml);
      mailSender.send(message);
    } catch (Exception e) {
      log.error("Failed to send email to {} with subject {}: {}", to, subject, e.getMessage(), e);
      throw new ApiException(
          ErrorCode.INTERNAL_SERVER_ERROR, ErrorMessageConstants.SYSTEM_EMAIL_SEND_FAILED);
    }
  }

  /**
   * @param to : recipient of the email
   * @param subject : subject of the email
   * @param templateName : name of the email template
   * @param model : model data to be used in the template
   */
  @Async
  public void sendEmailFromTemplate(
      String to, String subject, String templateName, Map<String, Object> model) {
    Context context = new Context();
    context.setVariables(model);
    String content = templateEngine.process(templateName, context);
    sendEmail(to, subject, content, false, true);
  }

  @Async
  public void sendActivationEmail(String to, String code) {

    String activationLink =
        MessageFormat.format(AppConstant.FRONTEND_URL + "/auth/verify-email?code={0}", code);

    String subject = "Xác thực tài khoản email của bạn";
    String templateName = "activationEmail";
    Map<String, Object> model = new HashMap<>();
    model.put("activationLink", activationLink);
    sendEmailFromTemplate(to, subject, templateName, model);
    log.info("Sent activation email to {}", to);
  }
}
