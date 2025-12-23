// const CONFIG = {
//   TELEGRAM_BOT_TOKEN: "8578454872:AAGgCs6T1P5sZAuZh82JfQ52tqyyal3W5AA",
//   REPO_OWNER: "ivashinaalenawork",
//   REPO_NAME: "PegasBot",
//   GOOGLE_SHEET_ID: "1_eWXwpus15aBRquTf5PNhzDK1HwJA8Zp21xJH7kYFPw",
//   WEBHOOK_SECRET: "my_telegram_bot_pegas_2025_key",
// };
const TelegramBot = require("node-telegram-bot-api");
const { google } = require("googleapis");
const { exec } = require("child_process");
const path = require("path");
require("dotenv").config();

const config = {
  telegram: {
    token: "8578454872:AAGgCs6T1P5sZAuZh82JfQ52tqyyal3W5AA",
    chatId: "1283692738",
  },
  googleSheets: {
    privateKey:
      "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCdOTokxCzVUD6R\nbZvhvWpGflpkZ6DktFywbxRRSWNgza70yy3bo0jzRFu98yUHVvQ1jp8Y2IsC89q6\nHOf7WPPBBs7WSzsZ97rUd0RYo3R5+HOm+WB6w0XYCaPnJYfkI8wIv7CsTMOCZv2j\nNpLw4eZt62lOJRH0ysaJ4FQjrLOGFTBB2Lkf9i6Zz48LEMLsh4RINudHsIcXeiHy\nKmKxbhBjmC5iYTn+h+jdyELZ96BmQvOGV/hJvq7rsd/dZiI6zjnAs/0YfIuUxiaO\nzMAiL+pZTsckjhRfxRJx6nlZoBTSdCakwjWbUx/GRsvXpmEYpRhX4Kmg7kU66U56\n0EBwJtm7AgMBAAECggEAQkzSKJPzhga/Q8txi0m5ib2Zt7J9hkRKu/ozmq20cyt5\nZnBRx8e9KRzABUOF72jrNbSNgcg7IsUbjRVIfFVAATuyOGrkIui1SAh9cVWIdjDf\n8F9EILC9AMPb8ssAWaQA1AWl5pq+bXyp48xNPbg9WEgIEbSPNGfYPmczhBG9aMJY\nSWp9R2ssOayuP6vaCEfy81ruL2S4JXXid26U0Hw+1seWcGmeGEsImf5hFEbeACbb\nHLmn+0e5U9/2tUBI/r8T/H2PDbxvq4njKj2qG5ScHEI2XDdLmZyYbYEvNl46K1Sa\nmpSDImpPEDV+St6OtNdb8Pu0yEQrh48RZdpbTchG+QKBgQDRbmnhhXbOciob7rme\nQe/Iiy6GPlYmsuIfweERR5pLyE/VL2oQ1SLGGaXeQhENVERZJ/57kNIdRWHxEJc/\n62W7YSBQYEa5TE989GtoXMMzNubxtAyWr7UoBdwRxD3SdrU7cEU6xGXmSGdqiYkR\nWT1lA0ix4k7sUwPOkwXR48xHeQKBgQDALvWQJ0Fw7CoBaEmorHuIx3pdq8hX3CXZ\nwu9Wp9tqlAHSWyALIHuV/79OBIjJnH94DqbiGmN/PjExQZj3Ppl+THGHy0h4C/Oj\ndw1khjOwnBjEcTx1lof+OceZmpXrU4bgpxOSqaKcQ5tpeMqCAqB7E7fSNfNHEU5r\nLhFPzE450wKBgHFiPq6bDDQ+uK+AsjuM5R2ExL5nF0tCQ4v/8jLhuhZXL2lyjxDn\n4zivAA7xY7v8qDhAn9UUFb1FJ/5UBh7T+bLVpaH+TavaNZqn1VKeDgw3KBcpbDtU\ni1ZMvdVckj/Uhs/UO5bSZ3yiLGMQbQXYc5WxjnTH2gS1+PSowljc5Ga5AoGAd6xG\nSe/H9nN5bMruI1TU0EW3UyEnbl6uSz3yH/oCzglAYSdRetxNWQiarhBwxWrojXBC\nR0W7c37czxlUEZIvrtAXWkIh7G801jPKaTCQe4eYfKsuxOJp6Ms+Gc6DULkAomAn\n9gogMkJ/QlxvbioImNucehASX8zNEjzrls9YXvUCgYA4ZFgp47BQCvtl/FDH4YMI\nLd+glw32mXnbeAnz29sh9nxAZYJ4t7BmqhngbIbg7VBp/j9EcWMe6Hx9xEDrStgI\nSzPdifrLBnIu/8/52v9C15aJT918bwN/X8zqEwqcYdvM8FqlUuhA39bQX5I8pCd8\nWhwdI170h3mtSLaY6X0EVA==\n-----END PRIVATE KEY-----\n",
    clientEmail: "pegascurrency@pegas-482010.iam.gserviceaccount.com",
    sheetId: "1_eWXwpus15aBRquTf5PNhzDK1HwJA8Zp21xJH7kYFPw",
  },
};

// Проверка конфигурации
console.log("🔧 Проверка конфигурации...");
console.log("Telegram Bot Token:", config.telegram.token ? "✅" : "❌");
console.log(
  "Google Service Email:",
  config.googleSheets.clientEmail ? "✅" : "❌"
);
console.log("Spreadsheet ID:", config.googleSheets.sheetId ? "✅" : "❌");

// Инициализация бота
const bot = new TelegramBot(config.telegram.token, { polling: true });

console.log("\n🤖 Локальный Telegram бот запущен");
console.log("Ожидаю команды...\n");

// ===== КОМАНДЫ БОТА =====

// /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const userName = msg.from.first_name;

  bot.sendMessage(
    chatId,
    `👋 Привет, ${userName}!\n` +
      "Я локальный бот для мониторинга курса валют Pegas Touristik.\n\n" +
      "📊 <b>Доступные команды:</b>\n" +
      "/stats - показать статистику из таблицы\n" +
      "/parse - запустить парсинг курса\n" +
      "/help - справка по командам\n" +
      "/debug - техническая информация",
    { parse_mode: "HTML" }
  );

  console.log(`👤 Пользователь ${userName} использовал /start`);
});

// /help
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(
    chatId,
    "🤖 <b>Справка по командам:</b>\n\n" +
      "/stats - показать последние 10 записей из Google Таблицы\n" +
      "/parse - запустить процесс сбора курса валют с сайта Pegas\n" +
      "/debug - техническая информация о системе\n" +
      "/help - эта справка\n\n" +
      "<i>Бот работает в локальном режиме</i>",
    { parse_mode: "HTML" }
  );
});

// /parse - запуск парсинга
bot.onText(/\/parse/, async (msg) => {
  const chatId = msg.chat.id;
  const userName = msg.from.first_name;

  console.log(`🔄 ${userName} запускает парсинг...`);

  bot.sendMessage(
    chatId,
    "🔄 <b>Запускаю парсинг курса валют...</b>\nПожалуйста, подождите 10-15 секунд.",
    { parse_mode: "HTML" }
  );

  try {
    // Запускаем скрипт парсинга
    exec("node survey.js", (error, stdout, stderr) => {
      if (error) {
        console.error("❌ Ошибка парсинга:", error);
        bot.sendMessage(
          chatId,
          "❌ <b>Ошибка парсинга</b>\n" +
            "Не удалось выполнить парсинг.\n" +
            "Ошибка: " +
            error.message,
          { parse_mode: "HTML" }
        );
        return;
      }

      console.log("✅ Парсинг завершен");
      console.log("Вывод:", stdout);

      // Ищем курс в выводе
      const rateMatch = stdout.match(/Курс: (.+)/);
      const rate = rateMatch ? rateMatch[1] : "не найден";

      bot.sendMessage(
        chatId,
        "✅ <b>Парсинг завершен успешно!</b>\n\n" +
          `💰 Курс: ${rate}\n` +
          `📅 Время: ${new Date().toLocaleString("ru-RU")}\n` +
          "✅ Данные сохранены в Google Таблицу",
        { parse_mode: "HTML" }
      );
    });
  } catch (error) {
    console.error("Ошибка:", error);
    bot.sendMessage(chatId, "❌ Произошла ошибка при запуске парсинга");
  }
});

// /stats - статистика из Google Sheets
bot.onText(/\/stats/, async (msg) => {
  const chatId = msg.chat.id;

  console.log("📊 Запрос статистики...");

  try {
    // Авторизация Google
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: config.googleSheets.clientEmail,
        private_key: config.googleSheets.privateKey,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // Чтение данных
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: config.googleSheets.sheetId,
      range: "Лист1!A:B",
    });

    const values = response.data.values || [];

    if (values.length <= 1) {
      bot.sendMessage(chatId, "📭 Данных еще нет в таблице");
      return;
    }

    // Формируем сообщение (последние 10 записей)
    let message = "📊 <b>Последние данные о курсе:</b>\n\n";

    // Пропускаем заголовок и берем последние 10
    const data = values.slice(1).slice(-10).reverse();

    data.forEach((row, index) => {
      const date = new Date(row[0]);
      const rate = row[1] || "нет данных";

      message += `${index + 1}. ${date.toLocaleDateString(
        "ru-RU"
      )} ${date.toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
      })}: <b>${rate}</b>\n`;
    });

    message += `\nВсего записей: ${values.length - 1}`;

    bot.sendMessage(chatId, message, { parse_mode: "HTML" });
  } catch (error) {
    console.error("Ошибка получения статистики:", error);
    bot.sendMessage(
      chatId,
      "❌ <b>Ошибка получения статистики</b>\n" +
        "Не удалось прочитать данные из таблицы.",
      { parse_mode: "HTML" }
    );
  }
});

// /debug - техническая информация
bot.onText(/\/debug/, (msg) => {
  const chatId = msg.chat.id;

  const debugInfo =
    "🔧 <b>Техническая информация:</b>\n\n" +
    `👤 Пользователь: ${msg.from.first_name}\n` +
    `💬 Chat ID: <code>${chatId}</code>\n` +
    `🤖 Бот: @pegas_currency_bot\n` +
    `🖥 Режим: Локальный\n` +
    `📅 Время: ${new Date().toLocaleString("ru-RU")}\n` +
    `📊 Таблица строк: (запросите /stats)\n\n` +
    `<i>Система работает на вашем компьютере</i>`;

  bot.sendMessage(chatId, debugInfo, { parse_mode: "HTML" });
});

// Обработка неизвестных команд
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // Пропускаем команды которые уже обработаны
  if (text && !text.startsWith("/")) {
    bot.sendMessage(
      chatId,
      "🤔 Я понимаю только команды:\n\n" +
        "/start - начало работы\n" +
        "/parse - запустить парсинг\n" +
        "/stats - статистика\n" +
        "/help - справка"
    );
  }
});

// Обработка ошибок
bot.on("polling_error", (error) => {
  console.error("❌ Ошибка polling:", error.message);
});

console.log("✅ Бот готов к работе!");
console.log("Напишите боту в Telegram: /start");
