const TelegramApi = require("node-telegram-bot-api");
const { gameOptions, againOptions } = require("./option");
const token = `5755347254:AAEKv9zPVeikEKhkaRO49oiC2A2oiCxV-KI`;

const bot = new TelegramApi(token, { polling: true });

const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(chatId, "Сейчас я загадаю цифру от 0 до 9, а ты должен её угадать");
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, "Отгадывай", gameOptions);
};

const start = () => {
  bot.setMyCommands([
    { command: "/start", description: "Начальное приветсвие" },
    { command: "/info", description: "Получить информацию " },
    { command: "/game", description: "Сыграй в игру" },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    if (text === "/start") {
      await bot.sendSticker(chatId, "CAACAgIAAxkBAAIBNmNIaqwz6vgCwDVtzF9pd_tD9hEjAAJrAwACbbBCAwHGsx_cSPsaKgQ");
      return bot.sendMessage(chatId, `Добро пожаловать ${msg.from.first_name}`);
    }
    if (text === "/info") {
      return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name || ""}`);
    }
    if (text === "/game") {
      return startGame(chatId);
    }
    console.log(msg);
    return bot.sendMessage(chatId, "Я тебя не понимаю");
  });

  bot.on("callback_query", (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === "/again") {
      startGame(chatId);
    }
    if (+data === +chats[chatId]) {
      return bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${data}`, againOptions);
    } else {
      return bot.sendMessage(chatId, `К сожалению ты не угадал, бот загадал цифру ${chats[chatId]}`, againOptions);
    }
  });
};

start();
