const root = require("./BotConfig/ROOT");
const bot = require("./BotConfig/BOT");

const {spec_symbols} = require("./MessagesConfig/config_messages")

const menuActivity = require("./Activities/modeMainMenu");
const lessonsActivity = require("./Activities/modeLessonsMenu")
const homeworkActivity = require("./Activities/modeHomeworkMenu")


bot.bot.on("message", (msg) => {
    const ChatID = msg.chat.id
    const text = msg.text || ''

    try{
        // Shows main menu
        if (menuActivity.mainMenuActivity(text, ChatID, msg)) return 

        // Parses lessons from mirea API
        if (lessonsActivity.lessonsGetActivity(text, ChatID)) return

        // Manage homework with mysql
        if (homeworkActivity.homeworkManageActivity(text, ChatID, msg)) return
    }

    catch(err){
        console.log("Can't handle message", err)
    }
})