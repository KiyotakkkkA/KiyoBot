const root = require("./BotConfig/ROOT");
const bot = require("./BotConfig/BOT");

const {activities} = require('./commandsConfig');
const {buttons} = require('./commandsConfig');

const menuActivity = require("./Activities/modeMainMenu");


bot.bot.on("message", (msg) => {
    const ChatID = msg.chat.id
    const text = msg.text || ''

    try{
        if (menuActivity.mainMenuActivity(text, ChatID, msg)) return 
    }

    catch(err){
        console.log("Can't handle message", err)
    }
})