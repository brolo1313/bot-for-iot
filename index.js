import BotService from "./bot/BotService.js";
import express from "express";

const TOKEN = process.env.TELEGRAM_TOKEN || "YOUR_TELEGRAM_BOT_TOKEN";
const port = process.env.PORT || 3000;

const bot = new BotService(TOKEN);

const app = express();

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.use(express.json());

const accessAllow = [
  { isAdmin: true, name: "Andrew", id: 848048961 },
  { isAdmin: false, name: "Yaroslava", id: 123456789 },
];

app.listen(port, () => {
  console.log(`Express server is listening on ${port}`);
});
