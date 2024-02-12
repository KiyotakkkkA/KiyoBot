const bot = require("../BotConfig/BOT")
const root = require("../BotConfig/ROOT")

const {error_messages, spec_symbols} = require("../MessagesConfig/config_messages")
const {buttons} = require('../commandsConfig');

var Settings = {
    __BLOCKED__: false
}

var admin_buttons = [
    [buttons.adminChangeModeOff, "Заблокировать пользователя [WIP]"],
    ["Сделать объявление [WIP]", "..."],
    [buttons.backToMenu]
]

function checkPermission(text, msg, command, ChatId) {
    if (text == command && msg.from.id != root.__ROOT_ID__){
        bot.BotMsg(ChatId, error_messages['ERROR_NoPerm'])
        return false
    }

    if (text == command && msg.from.id == root.__ROOT_ID__){
        return true
    }

    return false
}

function enableBot(text, ChatId, msg){
    if (text == buttons.adminChangeModeOn && msg.from.id == root.__ROOT_ID__){
        Settings.__BLOCKED__ = false
        bot.BotMsg(ChatId, "[" + spec_symbols['SB_success'] + "] Бот включен...")
        return true
    }

    if (msg.from.id == root.__ROOT_ID__){
        bot.bot.sendMessage(ChatId, "[" + spec_symbols["SB_error"] + "] Бот неактивен", {
            reply_markup: {
            keyboard: [
                [buttons.adminChangeModeOn]
            ]
        }
        })

        return true
    }
    return false
}

function AdminPanelActivity(text, ChatId, msg){
    if (text == buttons.mainMenuAdminPanel){
        if (msg.from.id != root.__ROOT_ID__){
            bot.BotMsg(ChatId, error_messages['ERROR_NoPerm'])
            return true
        }
        bot.bot.sendMessage(ChatId, "Админ-панель - выберите опцию", {
            reply_markup: {
            keyboard: admin_buttons
        }
        })
    }
    if (checkPermission(text, msg, buttons.adminChangeModeOff, ChatId)) {
        Settings.__BLOCKED__ = !Settings.__BLOCKED__
        bot.BotMsg(ChatId, "[" + spec_symbols['SB_success'] + "] Бот выключен...")
        return true
    }
}

module.exports = {AdminPanelActivity, Settings, enableBot}