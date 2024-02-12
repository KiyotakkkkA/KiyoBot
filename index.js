const root = require("./BotConfig/ROOT");
const bot = require("./BotConfig/BOT");

const {spec_symbols} = require("./MessagesConfig/config_messages")

const menuActivity = require("./Activities/modeMainMenu");
const lessonsActivity = require("./Activities/modeLessonsMenu")
const homeworkActivity = require("./Activities/modeHomeworkMenu")
const feedbackActivity = require("./Activities/modeFeedbackMenu")
const adminpanelActivity = require("./Activities/modeAdminPanelMenu")


bot.bot.on("message", (msg) => {
    const ChatID = msg.chat.id
    const text = msg.text || ''

    adminpanelActivity.AdminPanelActivity(text, ChatID, msg)

    if (adminpanelActivity.Settings.__BLOCKED__){
        if (!adminpanelActivity.enableBot(text, ChatID, msg)){
            bot.BotMsg(ChatID, "[" + spec_symbols['SB_error'] + "] Администратор отключил приём сообщений!")
            return
        }
    }

    try{

        // Hide menu
        if (msg.text.includes('@db')){
            bot.BotMsg(ChatID, `[${spec_symbols["SB_success"]}] Меню скрыто`)
            return
        }

        // Shows main menu
        if (menuActivity.mainMenuActivity(text, ChatID, msg)) return 

        // Parses lessons from mirea API
        if (lessonsActivity.lessonsGetActivity(text, ChatID)) return

        // Manages homework with mysql
        if (homeworkActivity.homeworkManageActivity(text, ChatID, msg)) return

        // Supports the feedback
        if (feedbackActivity.feedbackActivity(text, ChatID, msg)) return
    }

    catch(err){
        console.log("Can't handle message", err)
    }
})