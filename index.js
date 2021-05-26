const TelegramApi = require("node-telegram-bot-api");
const envfi = require('dotenv').config();
const token = process.env.DB_TOKEN;


const bot = new TelegramApi(token, { polling: true });

const chats = {};

const gameOpt = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [
        { text: "1", callback_data: `1` },
        { text: "2", callback_data: `2` },
        { text: "3", callback_data: `3` },
      ],
      [
        { text: "4", callback_data: `4` },
        { text: "5", callback_data: `5` },
        { text: "6", callback_data: `6` },
      ],
      [
        { text: "7", callback_data: `7` },
        { text: "8", callback_data: `8` },
        { text: "9", callback_data: `9` },
      ],
      [{ text: "0", callback_data: `0` }],
    ],
  }),
};

const againOpt = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [{ text: "Попробовать еще раз", callback_data: `/again` }],
    ],
  }),
};

const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    `Будет загаданно число от 0 - 9,ваша задача угадать его!`
  );
  const randNum = Math.floor(Math.random() * 10);
  console.log(randNum);
  chats[chatId] = randNum;
  return bot.sendMessage(chatId, `Число было загаданно`, gameOpt);
};


const start = () => {
  bot.setMyCommands([
    { command: "/start", description: "Начальное приветствие" },
    { command: "/game", description: "Игра - Угадай число" },
  ]);

  bot.on("message", async (msg) => {
    const userName = msg.from.first_name;
    const text = msg.text;
    const chatId = msg.chat.id;
    if (text === "/start") {
      await bot.sendSticker(
        chatId,
        "https://tgram.ru/wiki/stickers/img/PopCatAnimated/gif/9.gif"
      );
      return bot.sendMessage(
        chatId,
        `Добро пожаловать ${userName} ! Мы рада вас видеть `
      );
    }

    if (text === "/game") {
       return  startGame(chatId);
    }
    await bot.sendMessage(chatId, "Я тебя не понимаю,попробуй еще раз");
  })
  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    if(data === "/again"){
        return startGame(chatId);
    }

    if (data === chats[chatId]) {
      return bot.sendMessage(
        chatId,
        `Вы верно отгадали загаданное число ${chats[chatId]} ! `,
        againOpt
      );
    } else {
      return bot.sendMessage(
        chatId,
        `К сожалению вы не отгадали заданное число ${chats[chatId]} ! `,
        againOpt
      );
    }
    console.log(msg);
  });
};

start()