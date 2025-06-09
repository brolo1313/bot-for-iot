const TOKEN = process.env.TELEGRAM_TOKEN || "YOUR_TELEGRAM_BOT_TOKEN";
const port = process.env.PORT || 3000;

const TelegramBot = require("node-telegram-bot-api");
const express = require("express");

const bot = new TelegramBot(TOKEN, { polling: true });

const app = express();

app.use(express.json());

const accessAllow = [
  { isAdmin: true, name: "Andrew", id: 848048961 },
  { isAdmin: false, name: "Yaroslava", id: 123456789 },
];

app.listen(port, () => {
  console.log(`Express server is listening on ${port}`);
});

//BOT LOGIC
bot.on("message", (msg) => {
  const isHasAccess = accessAllow.find((item) => item.id === msg.from.id);
  if (!isHasAccess) {
    bot.sendMessage(msg.chat.id, `❌ <b>Доступ заборонено!</b>`, {
      parse_mode: "HTML",
    });

    bot.sendMessage(
      848048961,
      `⚠️ <b>Користувач ${msg.from.first_name} - ${msg.from.username} намагався отримати доступ</b>`,
      {
        parse_mode: "HTML",
      }
    );
    return;
  }
  sendStartMessage(msg);
});

bot.on("callback_query", (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  console.log("query", query);
  if (data === "air_on") {
    bot.sendMessage(chatId, "✅ AIR увімкнено");
  } else if (data === "air_off") {
    bot.sendMessage(chatId, "⛔ AIR вимкнено");
  }

  bot.answerCallbackQuery(query.id);
});

function sendStartMessage(msg) {
  bot.sendMessage(msg.chat.id, "Виберіть опцію:", {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "🟢 Увімкнути AIR", callback_data: "air_on" },
          { text: "🔴 Вимкнути AIR", callback_data: "air_off" },
        ],
      ],
    },
  });
}
