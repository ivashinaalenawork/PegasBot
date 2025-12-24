const CONFIG = require("./config.js");
const axios = require("axios");

async function handleUpdate(update) {
  try {
    if (update.message && update.message.text) {
      const chatId = update.message.chat.id;
      const text = update.message.text.trim();

      if (text === "/get") {
        const triggerResult = await triggerGitHubWorkflow();

        if (triggerResult) {
          await sendTelegramMessage(
            chatId,
            "Запрос на обновление отправлен. Ожидайте..."
          );
        } else {
          await sendTelegramMessage(
            chatId,
            "Не удалось запустить обновление. Попробуйте позже."
          );
        }
      }
    }
  } catch (error) {
    console.error("Ошибка:", error);
  }
}

async function sendTelegramMessage(chatId, text) {
  try {
    const url = `https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/sendMessage`;

    await axios.post(url, {
      chat_id: chatId,
      text: text,
    });

    console.log(`Сообщение отправлено в чат ${chatId}: ${text}`);
    return true;
  } catch (error) {
    console.error("Ошибка отправки сообщения в Telegram:", error);
    return false;
  }
}

async function triggerGitHubWorkflow() {
  try {
    const url = `https://api.github.com/repos/${CONFIG.GITHUB_REPO}/dispatches`;

    const response = await axios.post(
      url,
      {
        event_type: "run-parser",
      },
      {
        headers: {
          Authorization: `token ${CONFIG.GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
      }
    );

    console.log("GitHub API ответ:", response.status);
    return true;
  } catch (error) {
    console.error(
      "Ошибка при запуске GitHub Actions:",
      error.response?.data || error.message
    );
    return false;
  }
}

// Для вебхука Telegram
module.exports = async (req, res) => {
  try {
    const update = req.body;
    console.log("Получен update от Telegram:", JSON.stringify(update, null, 2));

    await handleUpdate(update);

    res.status(200).send("OK");
  } catch (error) {
    console.error("Ошибка обработки вебхука:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Для тестирования вручную
if (require.main === module) {
  const testUpdate = {
    message: {
      chat: { id: CONFIG.TELEGRAM_CHAT_ID },
      text: "/get",
    },
  };

  handleUpdate(testUpdate).then(() => {
    console.log("Тест завершен");
    process.exit(0);
  });
}
