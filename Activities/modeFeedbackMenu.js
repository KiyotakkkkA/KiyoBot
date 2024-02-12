const bot = require("../BotConfig/BOT")
const root = require("../BotConfig/ROOT");

const {info_messages, spec_symbols} = require("../MessagesConfig/config_messages")
const {buttons} = require('../commandsConfig');

function feedbackActivity(text, ChatId, msg) {
    if (text == buttons.mainMenuReview){
        bot.BotMsg(ChatId, spec_symbols['SB_write'] + " Оставьте вашу жалобу/предложение (воспользуйтесь опцией 'ответить' на это сообщение)")
        return true
    }
    if (msg.reply_to_message){
        if (msg.reply_to_message.text == spec_symbols['SB_write'] + " Оставьте вашу жалобу/предложение (воспользуйтесь опцией 'ответить' на это сообщение)"){
            bot.BotMsg(root.__ROOT_ID__, "Сообщение от: <b><u>" + msg.chat.first_name + " " + msg.chat.last_name + "</u></b> - @" + msg.chat.username)
            bot.bot.forwardMessage(root.__ROOT_ID__, ChatId, msg.message_id)
            bot.BotMsg(ChatId, info_messages['INFO_SendSuccess'])
            return true
        }
    }
    return false
}

module.exports = {feedbackActivity}