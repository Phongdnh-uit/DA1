package com.phongdnh.se121.configurations;

import com.phongdnh.se121.services.bot.TelegramBot;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;
import org.telegram.telegrambots.meta.TelegramBotsApi;
import org.telegram.telegrambots.updatesreceivers.DefaultBotSession;

@Configuration
@ConditionalOnProperty(name = "telegram.bot.enabled", havingValue = "true", matchIfMissing = false)
@RequiredArgsConstructor
public class TelegramConfig {
  private final TelegramBot telegramBot;

  @PostConstruct
  public void init() throws Exception {
    TelegramBotsApi api = new TelegramBotsApi(DefaultBotSession.class);
    api.registerBot(telegramBot);
  }
}
