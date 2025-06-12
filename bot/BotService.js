import TelegramBot from "node-telegram-bot-api";
import { accessAllow } from "../config/access.js";
import { inlineKeyboard } from "../bot/commands.js";
import { sendCommandToIot } from "../helpers/api.js";

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
    const command = query.data;

    const actionMap = {
      air_on: {
        successMsg: "✅ *AIR увімкнено* 🔛",
        failMsg: "❌ *Помилка увімкнення*",
        expectedAction: "on",
      },
      air_off: {
        successMsg: "❎ *AIR вимкнено* 🔴",
        failMsg: "❌ *Помилка виключення*",
        expectedAction: "off",
      },
    };

    if (!actionMap[command]) {
      this.bot.sendMessage(chatId, "⚠️ Невідома команда");
      return;
    }

    const { successMsg, failMsg, expectedAction } = actionMap[command];
    const response = await sendCommandToIot(command);

    const isSuccess =
      response &&
      response.status?.toLowerCase().trim() === "ok" &&
      response.action === expectedAction;

    this.bot.sendMessage(chatId, isSuccess ? successMsg : failMsg, {
      parse_mode: "Markdown",
    });

    this.bot.answerCallbackQuery(query.id);
  }
}

export default BotService;
