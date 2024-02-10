const bot = require("../BotConfig/BOT")
const root = require("../BotConfig/ROOT")

const {buttons} = require('../commandsConfig');

var Modes = {
    lessonsMode: false,
    homeworkMode: false
}

var keys = [
    [buttons.mainMenuHomework, buttons.mainMenuLessons, buttons.mainMenuTeachers],
    [buttons.mainMenuProfile, buttons.workInProgress, buttons.mainMenuReview],
    ["..."]
]

function mainMenuActivity(text, ChatId, msg){
    if (msg.from.id == root.__ROOT_ID__){
        keys[2] = [buttons.mainMenuAdminPanel]
    }
    if (text == "/menu"){
        bot.bot.sendMessage(ChatId, 'Выбери раздел:', {
            reply_markup: {
                keyboard: keys
            }
        })
        return true
    }
    if (text == buttons.backToMenu){
        Modes.lessonsMode = false;
        Modes.homeworkMode = false;
        bot.bot.sendMessage(ChatId, 'Выбери раздел:', {
            reply_markup: {
                keyboard: keys
            }
        })
        return true
    }
    return false
}

module.exports = {mainMenuActivity, Modes}