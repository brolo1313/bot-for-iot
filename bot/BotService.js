import TelegramBot from "node-telegram-bot-api";
import { accessAllow } from "../config/access.js";
import { inlineKeyboard } from "../bot/commands.js";

class BotService {
  constructor(token) {
    this.bot = new TelegramBot(token, { polling: true });
    this.adminId = accessAllow.find((u) => u.isAdmin)?.id;
    this.init();
  }

  init() {
    this.bot.setMyCommands([
      { command: "start", description: "Запустити бота" },
    ]);

    this.bot.on("text", (msg) => this.handleText(msg));
    this.bot.on("callback_query", (query) => this.handleCallback(query));
  }

  handleText(msg) {
    const user = accessAllow.find((item) => item.id === msg.from.id);
    const chatId = msg.chat.id;

    if (!user) {
      this.bot.sendMessage(chatId, `❌ <b>Доступ заборонено!</b>`, {
        parse_mode: "HTML",
      });
      this.bot.sendMessage(
        this.adminId,
        `⚠️ ${msg.from.first_name} (@${msg.from.username}) намагався отримати доступ`,
        {
          parse_mode: "HTML",
        }
      );
      return;
    }

    if (msg.text === "/start") {
      this.bot.sendMessage(chatId, "Виберіть опцію:", inlineKeyboard);
    } else {
      this.bot.sendMessage(chatId, "❌ Не розпізнана команда");
    }
  }

  async handleCallback(query) {
    const chatId = query.message.chat.id;
    const data = query.data;

    if (data === "air_on") {
      // await this.sendAirOn(); // підключити реальний запит
      this.bot.sendMessage(chatId, "✅ AIR увімкнено");
    } else if (data === "air_off") {
      this.bot.sendMessage(chatId, "⛔ AIR вимкнено");
    }

    this.bot.answerCallbackQuery(query.id);
  }

  async sendAirOn() {
    try {
      const response = await fetch("http://38.0.101.76/air_on");
      console.log("Air On Response:", response);
    } catch (err) {
      console.error("Error turning on air:", err);
    }
  }
}

export default BotService;
