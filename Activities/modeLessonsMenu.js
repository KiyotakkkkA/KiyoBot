const {lessons_info_cmds} = require("../MessagesConfig/config_general")

const bot = require("../BotConfig/BOT")
const parse = require("../ExternalCommands/GetLessonsFromMireaUtility")
const {buttons} = require('../commandsConfig');

const menuActivity = require("../Activities/modeMainMenu")

function lessonsGetActivity(text, ChatId){
    if (text == buttons.mainMenuLessons){
        bot.bot.sendMessage(ChatId, 'Расписание - Выбери день:', {
            reply_markup: {
                keyboard: [
                    ["Понедельник", "Вторник", "Среда"],
                    ["Четверг", "Пятница", "Суббота"],
                    [buttons.backToMenu]
                ]
            }
        })
        menuActivity.Modes.lessonsMode = true;
    }
    for (let cmd1 in lessons_info_cmds) {
        if (!menuActivity.Modes.lessonsMode){
            break
        }
        if (text.includes(lessons_info_cmds[cmd1])) {
            parse.getData(text.toLowerCase()).then(r => {
                bot.bot.sendMessage(ChatId, r, {
                    reply_markup: {
                        keyboard: [
                            ["Понедельник", "Вторник", "Среда"],
                            ["Четверг", "Пятница", "Суббота"],
                            [buttons.backToMenu]
                        ]
                    }, 
                    parse_mode: "html"
                })
            });
            return true;
        }
    }
}

module.exports = {lessonsGetActivity}