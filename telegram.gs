const CONFIG = require("./config");

function doPost(e) {
  try {
    const update = JSON.parse(e.postData.contents);

    if (update.message && update.message.text) {
      const chatId = update.message.chat.id;
      const text = update.message.text.trim();

      if (text === "/get") {
        // 1. Немедленно отвечаем пользователю
        sendTelegramMessage(chatId, "Запрашиваю актуальный курс...");

        // 2. Запускаем GitHub Actions workflow
        const triggerResult = triggerGitHubWorkflow();

        if (triggerResult) {
          sendTelegramMessage(
            chatId,
            "Запрос на обновление отправлен. Ожидайте"
          );
        } else {
          sendTelegramMessage(
            chatId,
            "Не удалось запустить обновление. Попробуйте позже."
          );
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
}

function sendTelegramMessage(chatId, text) {
  const url =
    "https://api.telegram.org/bot" + CONFIG.TELEGRAM_BOT_TOKEN + "/sendMessage";
  const payload = {
    chat_id: chatId,
    text: text,
  };
  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
  };

  UrlFetchApp.fetch(url, options);
}

function triggerGitHubWorkflow() {
  const url =
    "https://api.github.com/repos/" + CONFIG.GITHUB_REPO + "/dispatches";

  const payload = {
    event_type: "run-parser",
  };

  const options = {
    method: "post",
    headers: {
      Authorization: "token " + CONFIG.GITHUB_TOKEN,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    payload: JSON.stringify(payload),
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    console.log("GitHub API ответ:", response.getResponseCode());
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
