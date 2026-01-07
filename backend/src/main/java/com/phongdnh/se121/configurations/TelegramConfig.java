package com.phongdnh.se121.configurations;

import com.phongdnh.se121.services.bot.TelegramBot;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.telegram.telegrambots.meta.TelegramBotsApi;
import org.telegram.telegrambots.updatesreceivers.DefaultBotSession;

@Configuration
@ConditionalOnProperty(name = "telegram.bot.enabled", havingValue = "true", matchIfMissing = false)
public class TelegramConfig {
  private static boolean initialized = false;

  @Bean
  TelegramBotsApi telegramBotsApi(TelegramBot telegramBot) throws Exception {
    TelegramBotsApi telegramBotsApi = new TelegramBotsApi(DefaultBotSession.class);
    // Register the bot only once
    if (!initialized) {
      telegramBotsApi.registerBot(telegramBot);
      initialized = true;
    }
    telegramBotsApi.registerBot(telegramBot);
    return telegramBotsApi;
  }
}
