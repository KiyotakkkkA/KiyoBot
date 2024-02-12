const root = require("../BotConfig/ROOT")
const TelegramApi = require("node-telegram-bot-api");

const bot = new TelegramApi(root.__TOKEN__, {polling: true});

function BotMsg(id, txt, parse_m="html"){
    return bot.sendMessage(id, txt, {parse_mode: parse_m,
    reply_markup:{
        remove_keyboard: true
    }});
}

module.exports = {bot, BotMsg}