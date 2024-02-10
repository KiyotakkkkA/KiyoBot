const root = require("../BotConfig/ROOT")
const TelegramApi = require("node-telegram-bot-api");

const bot = new TelegramApi(root.__TOKEN__, {polling: true});

module.exports = {bot}