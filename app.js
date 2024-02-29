const TelegramBot = require("node-telegram-bot-api");
const db = require("./model/db");
require("dotenv").config();
const { TOKEN } = process.env;
const bot = new TelegramBot(TOKEN, { polling: true });

const resume = {};

//--------------------------------------------------------------------------------

function sendIntroductionMessage(chatId) {
  const options = {
    reply_markup: {
      inline_keyboard: [
        [{ text: "🇺🇿Uzbek", callback_data: "uz:tme" }],
        [{ text: "🇷🇺Russian", callback_data: "ru:tme" }],
      ],
    },
  };

  const introduction = `Assalomu alaykum!

🌐 Big Market rasmiy Telegram-botiga xush kelibsiz!
Iltimos, til tanlang.

➖➖➖➖➖➖➖➖➖➖

Здраствуйте!

🌐 Добро пожаловать на официальный Telegram-бот Big Market
Пожалуйста, выберите язык.`;

  bot.sendMessage(chatId, introduction, options);
}

//--------------------------------------------------------------------------------

function addUserDB(msg) {
  db.query(
    `SELECT id FROM users WHERE telegram_id = ?`,
    [msg.from.id],
    (error, results) => {
      if (error) {
        console.log(`error getting user by id ${error}`);
        return;
      }
      if (results.length == 0) {
        db.query(
          `INSERT INTO users (telegram_id, username, first_name, last_name) VALUES (?, ?, ?, ?)`,
          [
            msg.from.id,
            msg.from.username,
            msg.from.first_name,
            msg.from.last_name,
          ],
          (error, results) => {
            if (error) {
              console.log(`error inserting user ${error}`);
            }
          }
        );
      }
    }
  );
}

//--------------------------------------------------------------------------------

function getLang(chatId, callback) {
  db.query(
    `SELECT lang FROM users WHERE telegram_id = ?`,
    [chatId],
    (error, results) => {
      if (error) {
        console.log(`error getting lang by id ${error}`);
        callback(error, null);
      } else {
        callback(null, results);
      }
    }
  );
}

//--------------------------------------------------------------------------------

function updateLang(chatId, lang) {
  db.query(
    `UPDATE users SET lang = ? WHERE telegram_id = ?`,
    [lang, chatId],
    (error, results) => {
      if (error) {
        console.log(`error updating lang by id ${error}`);
      }
    }
  );
}

//--------------------------------------------------------------------------------

bot.on("message", (msg) => {
  const text = msg.text;
  const chatId = msg.chat.id;

  if (text == "/start") {
    addUserDB(msg);
  }

  if (text == "/start" || text == "/lang") {
    sendIntroductionMessage(chatId);
  }
});

//---------------------------------------------------------------------------------

function menuMessage(chatId) {
  const options = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "ℹ️Market haqida", callback_data: "info:tme" },
          { text: "💼Bo'sh ish o'rinlari", callback_data: "work:tme" },
        ],
        [
          { text: "📍Bizning manzilimiz", callback_data: "location:tme" },
          { text: "📞Qayta aloqa", callback_data: "call:tme" },
        ],
        [{ text: "🌐Tilni almashtirish", callback_data: "lang:tme" }],
      ],
    },
  };

  const message = `Assalomu alaykum!
Men Makro HR jamoasining yordamchisiman

Mening yordamim bilan siz:
💚 Makro supermarketlar tarmog'idagi bo'sh ish o'rinlari haqida eng so'nggi ma'lumotlarni topishingiz mumkin;
💚 Bo'sh ish o'rinlari uchun ariza/profilingizni yuboring;
💚 Makro jamoasiga a'zo bo'ling.`;

  const photo = "./img/dispatcher.jpg";

  bot
    .sendPhoto(chatId, photo, { caption: message, ...options })
    .then(() => {
      console.log("Photo message sent successfully");
    })
    .catch((error) => {
      console.error("Error sending photo message:", error);
    });
}

//---------------------------------------------------------------------------------

function infoMessage(chatId) {
  const options = {
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [[{ text: "◀️Ortga", callback_data: "back_menu:tme" }]],
    },
  };
  message = `💚MAKRO supermarketlari — bu shunchaki biz qurgan do'konlar, biz yetishtirgan professionallar jamoasi va biz har kuni xizmat ko’rsatadigan mijozlar emas, bundan ancha ko’proq narsani anglatadi.
Tarmoq boshqaruvida 2 format mavjud: ekspress 24/7 va  supermarket.
💚Bizning do’konlarimizda hamisha sizni yoqimli muhit kutadi, xushmuomala xodimlarimiz esa supermarketlarda o’tkazgan vaqtingizni juda qulay qiladi.

📌 [Bizning veb-saytimiz](https://makromarket.uz/)
📌 [Facebook](https://fb.com/makromarket.uz/)
📌 [Instagram](https://instagram.com/mamiroff_x/)
📌 [Telegram-kanali](https://t.me/mamiroff_xojiakbar)`;
  photo = "./img/info.jpg";

  bot.sendPhoto(chatId, photo, { caption: message, ...options });
}

//---------------------------------------------------------------------------------

function wrokTypeMessage(chatId) {
  const options = {
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [
          { text: "Sotuchi-Kassir", callback_data: "sotuvchi:tme" },
          { text: "Yukchi", callback_data: "yukchi:tme" },
        ],
        [
          { text: "Qo'riqchi", callback_data: "qoriqchi:tme" },
          { text: "Ofis", callback_data: "ofis:tme" },
        ],
        [{ text: "◀️Ortga", callback_data: "back_menu:tme" }],
      ],
    },
  };

  message = `Kim bo'lib ishlamoqchisz: `;

  bot.sendMessage(chatId, message, options);
}

//---------------------------------------------------------------------------------

function locationMessage(chatId) {
  const options = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "To'ytepa", callback_data: "toytepa:tme" },
          { text: "Chirchiq", callback_data: "chirchiq:tme" },
        ],
        [
          { text: "Toshkent", callback_data: "toshkent:tme" },
          { text: "Farg'ona", callback_data: "fargona:tme" },
        ],
        [
          { text: "Andijon viloyati", callback_data: "andijon:tme" },
          { text: "Qibray", callback_data: "qibray:tme" },
        ],
        [{ text: "◀️Ortga", callback_data: "back_work_type:tme" }],
      ],
    },
  };

  message = `Tugmani tanlang: `;

  bot.sendMessage(chatId, message, options);
}

//---------------------------------------------------------------------------------

function resumeMessage(chatId) {
  const options = {
    reply_markup: {
      inline_keyboard: [
        [{ text: "📝Anketani to'ldiring", callback_data: "anketa:tme" }],
        [{ text: "🚶‍♂️Suhbatga borish", callback_data: "suhbat:tme" }],
        [{ text: "◀️Bosh menu", callback_data: "back_menu:tme" }],
      ],
    },
  };
  message = `Agar sizda tayyor rezyume bo'lsa, uni shu yerga yuborishingiz mumkin "Qog'oz qisqichi 📎"ni bosing va faylni istalgan formatda yuboring`;
  photo = "./img/resume.jpg";

  bot.sendPhoto(chatId, photo, { caption: message, ...options });
}

//---------------------------------------------------------------------------------

bot.on("callback_query", (msg) => {
  const data = msg.data;
  const chatId = msg.message.chat.id;

  if (data == "uz:tme") {
    const lang = data.slice(0, 2);
    updateLang(msg.from.id, lang);

    bot
      .deleteMessage(chatId, msg.message.message_id)
      .then(() => {
        console.log("Message deleted successfully.");
        menuMessage(chatId);
      })
      .catch((error) => {
        console.error("Error deleting message:", error);
      });
  }

  if (data == "info:tme") {
    bot
      .deleteMessage(chatId, msg.message.message_id)
      .then(() => {
        console.log("Message deleted successfully.");
        infoMessage(chatId);
      })
      .catch((error) => {
        console.error("Error deleting message:", error);
      });
  }

  if (data == "back_menu:tme") {
    bot
      .deleteMessage(chatId, msg.message.message_id)
      .then(() => {
        console.log("Message deleted successfully.");
        menuMessage(chatId);
      })
      .catch((error) => {
        console.error("Error deleting message:", error);
      });
  }

  if (data == "work:tme") {
    bot
      .deleteMessage(chatId, msg.message.message_id)
      .then(() => {
        console.log("Message deleted successfully.");
        wrokTypeMessage(chatId);
      })
      .catch((error) => {
        console.error("Error deleting message:", error);
      });
  }
  if (
    data == "sotuvchi:tme" ||
    data == "yukchi:tme" ||
    data == "qoriqchi:tme"
  ) {
    bot
      .deleteMessage(chatId, msg.message.message_id)
      .then(() => {
        console.log("Message deleted successfully.");
        locationMessage(chatId);
      })
      .catch((error) => {
        console.error("Error deleting message:", error);
      });
  }
  if (data == "back_work_type:tme") {
    bot
      .deleteMessage(chatId, msg.message.message_id)
      .then(() => {
        console.log("Message deleted successfully.");
        wrokTypeMessage(chatId);
      })
      .catch((error) => {
        console.error("Error deleting message:", error);
      });
  }
  if (data == "ofis:tme") {
    bot
      .deleteMessage(chatId, msg.message.message_id)
      .then(() => {
        console.log("Message deleted successfully.");
        resumeMessage(chatId);
      })
      .catch((error) => {
        console.error("Error deleting message:", error);
      });
  }
  if (
    data == "toytepa:tme" ||
    data == "chirchiq:tme" ||
    data == "toshkent:tme" ||
    data == "andijon:tme" ||
    data == "qibray:tme" ||
    data == "fargona:tme"
  ) {
    const text = data.split(":")[0];
    bot
      .deleteMessage(chatId, msg.message.message_id)
      .then(() => {
        console.log("Message deleted successfully.");
        resume["Lakatsiya"] = text;
        console.log(resume);
        resumeMessage(chatId);
      })
      .catch((error) => {
        console.error("Error deleting message:", error);
      });
  }
  if (data == "lang:tme") {
    bot
      .deleteMessage(chatId, msg.message.message_id)
      .then(() => {
        console.log("Message deleted successfully.");
        sendIntroductionMessage(chatId);
      })
      .catch((error) => {
        console.error("Error deleting message:", error);
      });
  }
});

//--------------------------------------------------------------------------------

console.log("Bot is running...");
