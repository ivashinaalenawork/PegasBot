const { chromium } = require("playwright");
const { google } = require("googleapis");
const axios = require("axios");
require("dotenv").config();

const logs = {
  type: "service_account",
  project_id: "pegas-482010",
  private_key_id: "0a8370e46bee07079db4af3753c047f92af3f44e",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCdOTokxCzVUD6R\nbZvhvWpGflpkZ6DktFywbxRRSWNgza70yy3bo0jzRFu98yUHVvQ1jp8Y2IsC89q6\nHOf7WPPBBs7WSzsZ97rUd0RYo3R5+HOm+WB6w0XYCaPnJYfkI8wIv7CsTMOCZv2j\nNpLw4eZt62lOJRH0ysaJ4FQjrLOGFTBB2Lkf9i6Zz48LEMLsh4RINudHsIcXeiHy\nKmKxbhBjmC5iYTn+h+jdyELZ96BmQvOGV/hJvq7rsd/dZiI6zjnAs/0YfIuUxiaO\nzMAiL+pZTsckjhRfxRJx6nlZoBTSdCakwjWbUx/GRsvXpmEYpRhX4Kmg7kU66U56\n0EBwJtm7AgMBAAECggEAQkzSKJPzhga/Q8txi0m5ib2Zt7J9hkRKu/ozmq20cyt5\nZnBRx8e9KRzABUOF72jrNbSNgcg7IsUbjRVIfFVAATuyOGrkIui1SAh9cVWIdjDf\n8F9EILC9AMPb8ssAWaQA1AWl5pq+bXyp48xNPbg9WEgIEbSPNGfYPmczhBG9aMJY\nSWp9R2ssOayuP6vaCEfy81ruL2S4JXXid26U0Hw+1seWcGmeGEsImf5hFEbeACbb\nHLmn+0e5U9/2tUBI/r8T/H2PDbxvq4njKj2qG5ScHEI2XDdLmZyYbYEvNl46K1Sa\nmpSDImpPEDV+St6OtNdb8Pu0yEQrh48RZdpbTchG+QKBgQDRbmnhhXbOciob7rme\nQe/Iiy6GPlYmsuIfweERR5pLyE/VL2oQ1SLGGaXeQhENVERZJ/57kNIdRWHxEJc/\n62W7YSBQYEa5TE989GtoXMMzNubxtAyWr7UoBdwRxD3SdrU7cEU6xGXmSGdqiYkR\nWT1lA0ix4k7sUwPOkwXR48xHeQKBgQDALvWQJ0Fw7CoBaEmorHuIx3pdq8hX3CXZ\nwu9Wp9tqlAHSWyALIHuV/79OBIjJnH94DqbiGmN/PjExQZj3Ppl+THGHy0h4C/Oj\ndw1khjOwnBjEcTx1lof+OceZmpXrU4bgpxOSqaKcQ5tpeMqCAqB7E7fSNfNHEU5r\nLhFPzE450wKBgHFiPq6bDDQ+uK+AsjuM5R2ExL5nF0tCQ4v/8jLhuhZXL2lyjxDn\n4zivAA7xY7v8qDhAn9UUFb1FJ/5UBh7T+bLVpaH+TavaNZqn1VKeDgw3KBcpbDtU\ni1ZMvdVckj/Uhs/UO5bSZ3yiLGMQbQXYc5WxjnTH2gS1+PSowljc5Ga5AoGAd6xG\nSe/H9nN5bMruI1TU0EW3UyEnbl6uSz3yH/oCzglAYSdRetxNWQiarhBwxWrojXBC\nR0W7c37czxlUEZIvrtAXWkIh7G801jPKaTCQe4eYfKsuxOJp6Ms+Gc6DULkAomAn\n9gogMkJ/QlxvbioImNucehASX8zNEjzrls9YXvUCgYA4ZFgp47BQCvtl/FDH4YMI\nLd+glw32mXnbeAnz29sh9nxAZYJ4t7BmqhngbIbg7VBp/j9EcWMe6Hx9xEDrStgI\nSzPdifrLBnIu/8/52v9C15aJT918bwN/X8zqEwqcYdvM8FqlUuhA39bQX5I8pCd8\nWhwdI170h3mtSLaY6X0EVA==\n-----END PRIVATE KEY-----\n",
  client_email: "pegascurrency@pegas-482010.iam.gserviceaccount.com",
  client_id: "104321280869613374601",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/pegascurrency%40pegas-482010.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

const config = {
  googleSheets: {
    privateKey: logs.private_key,
    clientEmail: logs.client_email,
    sheetId: "1_eWXwpus15aBRquTf5PNhzDK1HwJA8Zp21xJH7kYFPw",
  },
  telegram: {
    botToken: "8578454872:AAGgCs6T1P5sZAuZh82JfQ52tqyyal3W5AA",
    chatId: "1283692738",
  },
};

async function findCurrency() {
  let browser;
  try {
    browser = await chromium.launch({ headless: false }); //заупск браузера
    const page = await browser.newPage(); //созд-е новой вкладки
    await page.goto("https://pegast.ru/", {
      waitUntil: "networkidle",
      timeout: 60000,
    });
    const selector = ".exchange__rate"; //поиск по селктору
    await page.waitForSelector(selector, { timeout: 20000 });
    const currentText = await page.textContent(selector); //получение контента селектора
    console.log(`Курс: ${currentText}`);

    await writeToGoogleSheets(new Date(), currentText);

    // Отправляем уведомление в Telegram
    await sendTelegramNotification(
      `Данные обновлены\n📅 ${new Date()}\n💱 ${currentText}`
    );

    return { success: true, data: { value: currentText } };
  } catch (error) {
    console.error(error);
    return { success: false, error: error.message };
  } finally {
    await browser?.close();
  }
}

async function writeToGoogleSheets(date, currency) {
  try {
    const auth = new google.auth.JWT({
      email: config.googleSheets.clientEmail,
      key: config.googleSheets.privateKey,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const sheets = google.sheets({ version: "v4", auth });
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: config.googleSheets.sheetId,
      range: "Лист1",
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [[date, currency]],
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function sendTelegramNotification(message) {
  try {
    const url = `https://api.telegram.org/bot${config.telegram.botToken}/sendMessage`;

    await axios.post(url, {
      chat_id: config.telegram.chatId,
      text: message,
      parse_mode: "HTML",
    });

    console.log("Уведомление отправлено в Telegram");
  } catch (error) {
    console.error("Ошибка отправки в Telegram:", error);
  }
}

module.exports = async (req, res) => {
  //запуск из гитхаб actions
  try {
    console.log("Запуск парсинга по запросу от GitHub Actions...");
    const result = await findCurrency();

    if (result.success) {
      console.log("Парсинг успешен:", result.data);
      res.status(200).json({ message: "Курс обновлен", data: result.data });
    } else {
      console.error("Ошибка парсинга:", result.error);
      res
        .status(500)
        .json({ error: "Ошибка при парсинге", details: result.error });
    }
  } catch (error) {
    console.error("Критическая ошибка:", error);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
};

if (require.main === module) {
  //запуск из командной строки
  findCurrency().then((result) => {
    process.exit(result.success ? 0 : 1);
  });
}

module.exports = { findCurrency };
