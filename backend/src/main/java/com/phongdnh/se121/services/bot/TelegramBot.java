package com.phongdnh.se121.services.bot;

import com.phongdnh.se121.constants.RedisKey;
import java.util.Collections;
import java.util.concurrent.TimeUnit;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Message;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.ReplyKeyboardMarkup;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.KeyboardButton;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.KeyboardRow;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

@Slf4j
@Component
public class TelegramBot extends TelegramLongPollingBot {

  @Value("${telegram.bot.username}")
  private final String botUsername;

  private final RedisTemplate<Object, Object> redisTemplate;

  public TelegramBot(
      @Value("${telegram.bot.token}") String botToken,
      @Value("${telegram.bot.username}") String botUsername,
      RedisTemplate<Object, Object> redisTemplate) {
    super(botToken);
    this.botUsername = botUsername;
    this.redisTemplate = redisTemplate;
  }

  @Override
  public void onUpdateReceived(Update update) {
    // Kiểm tra xem cập nhật có phải là một tin nhắn không.
    if (update.hasMessage()) {
      Message message = update.getMessage();
      // Nếu tin nhắn có chứa văn bản
      if (message.hasText()) {
        // Kiểm tra nếu người dùng gửi lệnh "/start"
        if (message.getText().equals("/start")) {
          handleStartCommand(message.getChatId());
        }
      }
      // Nếu tin nhắn là một Contact (người dùng chia sẻ số điện thoại)
      else if (message.hasContact()) {
        handleContactShared(message);
      }
    }
  }

  @Override
  public String getBotUsername() {
    return botUsername;
  }

  /**
   * Xử lý lệnh "/start" từ người dùng. Bot sẽ gửi một tin nhắn kèm theo nút "Chia sẻ số điện thoại"
   * để người dùng liên kết tài khoản.
   *
   * @param chatId ID của cuộc trò chuyện Telegram.
   */
  private void handleStartCommand(long chatId) {
    // --- Tạo bàn phím tùy chỉnh với nút yêu cầu số điện thoại ---
    // Tạo một nút bấm với văn bản "Chia sẻ số điện thoại"
    KeyboardButton keyboardButton =
        KeyboardButton.builder()
            .text("Chia sẻ số điện thoại")
            .requestContact(
                true) // Đặt thuộc tính này để yêu cầu chia sẻ số điện thoại của người dùng
            .build();

    // Tạo một hàng bàn phím và thêm nút vào
    KeyboardRow row = new KeyboardRow();
    row.add(keyboardButton);

    // Tạo bàn phím và thêm hàng bàn phím vào
    ReplyKeyboardMarkup keyboardMarkup =
        ReplyKeyboardMarkup.builder()
            .keyboard(Collections.singletonList(row)) // Thêm hàng vào bàn phím
            .resizeKeyboard(true) // Tự động điều chỉnh kích thước bàn phím
            .oneTimeKeyboard(true) // Ẩn bàn phím sau khi sử dụng
            .selective(true) // Chỉ hiển thị bàn phím cho người dùng hiện tại
            .build();

    // Tạo một đối tượng tin nhắn để gửi đi
    SendMessage sendMessage =
        SendMessage.builder()
            .chatId(String.valueOf(chatId)) // Đặt chat_id của người nhận
            .text(
                "👋 Chào mừng!\n\n"
                    + "🔐 Để hệ thống gửi mã OTP xác minh, vui lòng **chia sẻ số điện thoại** bằng"
                    + " cách nhấn nút bên dưới.\n\n"
                    + "⚠️ **Lưu ý quan trọng:**\n"
                    + "• Chức năng này **chỉ hoạt động trên ứng dụng Telegram điện thoại**.\n"
                    + "• Nếu bạn đang dùng Telegram Web hoặc Desktop, vui lòng mở liên kết này bằng"
                    + " **Telegram trên điện thoại** và thực hiện lại.")
            .replyMarkup(keyboardMarkup)
            .build();

    // --- Thực thi gửi tin nhắn ---
    try {
      execute(sendMessage); // Gửi tin nhắn có nút yêu cầu số điện thoại
      log.info("Đã gửi tin nhắn 'yêu cầu liên hệ' tới chat_id: {}", chatId);
    } catch (TelegramApiException e) {
      log.error(
          "Gửi tin nhắn phản hồi lệnh /start tới chat_id: {} thất bại. Lỗi: {}",
          chatId,
          e.getMessage());
    }
  }

  /**
   * Xử lý khi người dùng chia sẻ thông tin liên hệ (số điện thoại) với bot.
   *
   * @param message Đối tượng tin nhắn chứa thông tin Contact.
   */
  private void handleContactShared(Message message) {
    long chatId = message.getChatId(); // Lấy ID cuộc trò chuyện (cũng là Telegram User ID)
    String phoneNumber =
        message.getContact().getPhoneNumber(); // Lấy số điện thoại đã được Telegram xác thực

    log.info("Đã nhận contact từ chat_id: {}. Số điện thoại: {}", chatId, phoneNumber);
    // Lưu vào redis để xử lý sau
    // Lưu phone làm key và chatId làm value
    String redisKey = RedisKey.TELEGRAM_PHONE_KEY + phoneNumber;
    redisTemplate.opsForValue().set(redisKey, chatId, 10, TimeUnit.MINUTES);
    // Số trả về có dạng 84..., phần auth cần sửa lại
    // Gửi tin nhắn xác nhận lại cho người dùng
    SendMessage confirmationMessage =
        new SendMessage(
            String.valueOf(chatId),
            "Cảm ơn bạn! ✅\n\n"
                + "📱 Số điện thoại **"
                + phoneNumber
                + "** đã được liên kết thành công.\n\n"
                + "➡️ Vui lòng quay lại ứng dụng, nhập số điện thoại này và bấm **“Tiếp tục”** "
                + "để nhận mã OTP.\n\n"
                + "⏳ **Lưu ý quan trọng:**\n"
                + "• Phiên liên kết này chỉ có hiệu lực trong **5 phút**.\n"
                + "• Nếu quá thời gian trên, bạn cần thực hiện lại thao tác từ đầu.");
    try {
      execute(confirmationMessage); // Gửi tin nhắn xác nhận
      log.info("Đã gửi tin nhắn xác nhận tới chat_id: {}", chatId);
    } catch (TelegramApiException e) {
      log.error("Gửi tin nhắn xác nhận tới chat_id: {}. Lỗi: {}", chatId, e.getMessage());
    }
  }

  public void sendMessage(String chatId, String text) {
    SendMessage sendMessage = new SendMessage(String.valueOf(chatId), text);
    try {
      execute(sendMessage);
      log.info("Đã gửi tin nhắn tới Telegram chat_id: {}", chatId);
    } catch (TelegramApiException e) {
      log.error("Gửi tin nhắn tới Telegram chat_id: {} thất bại. Lỗi: {}", chatId, e.getMessage());
    }
  }
}
