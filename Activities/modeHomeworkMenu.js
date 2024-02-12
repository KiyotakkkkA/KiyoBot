const {error_messages, spec_symbols} = require("../MessagesConfig/config_messages")

const bot = require("../BotConfig/BOT")
const knex = require("../ExternalCommands/DatabaseUtility")
const Promise = require('bluebird')
const logg = require("../ExternalCommands/LogsUtility")
const homeW = require("../ExternalCommands/GetHomeworkUtility")

const menuActivity = require("../Activities/modeMainMenu")

const AHW = require("../ExternalCommands/HomeworkProcessing/AddHomeWork")
const EHW = require("../ExternalCommands/HomeworkProcessing/EditHomeWork")

const {buttons} = require('../commandsConfig');

var DataClass = {
    id_: '',
    task_: '',
    date_: '',
    subject_: '',

    setIdValue: function(n) {DataClass.id_ = n},
    setSubjectValue: function(n) {DataClass.subject_ = n},
    setTaskValue: function(n) {DataClass.task_ = n},
    setDateValue: function(n) {DataClass.date_ = n},
}

function HomeworkProccessing(text, ChatId){

    switch (text) {

        case (buttons.homeworkKnow):
            homeW.knowHomework(ChatId)
            break

        case (buttons.homeworkAdd):

            bot.BotMsg(ChatId, `${spec_symbols["SB_write"]} По какому предмету? (воспользуйтесь опцией 'ответить' на это сообщение)`)
            break

        case (buttons.homeworkEdit):

            homeW.knowHomework(ChatId)
            bot.BotMsg(ChatId, `${spec_symbols["SB_edit"]} Выбери ID нужной записи (воспользуйтесь опцией 'ответить' на это сообщение)`)
            break

        case (buttons.homeworkDelete):

            homeW.knowHomework(ChatId)
            bot.BotMsg(ChatId, `[🗑] Выбери ID нужной записи (воспользуйтесь опцией 'ответить' на это сообщение)`)
            break
    }
}

function homeworkManageActivity(text, ChatId, msg){
    if (text == buttons.mainMenuHomework){
        bot.bot.sendMessage(ChatId, 'Домашние задания - Выберите опцию:', {
            reply_markup: {
                keyboard: [
                    [buttons.homeworkAdd, buttons.homeworkKnow],
                    [buttons.homeworkEdit, buttons.homeworkDelete],
                    [buttons.backToMenu]
                ]
            }
        })
        menuActivity.Modes.homeworkMode = true;
    }

    HomeworkProccessing(text, ChatId, msg)
    if (msg.reply_to_message){
    
        // ADD
        if (AHW.AddHWProcessing(msg, ChatId)){
            return true
        }
        // ADD
        
        // EDIT
        if (EHW.EditHWProcessing(msg, ChatId)){
            return true
        }
        // EDIT

        // DELETE
        if (msg.reply_to_message.text === `[🗑] Выбери ID нужной записи (воспользуйтесь опцией 'ответить' на это сообщение)`){

            id_ = Number(msg.text)
            if (id_){

                Promise.all([knex('homework').where('id', id_).del()]).then(data => {
                    logg.logger(msg, 'Удалил задание')
                    bot.BotMsg(ChatId, `[${spec_symbols["SB_success"]}] Пользователь <u>${msg.from.first_name}</u> успешно удалил задание`)
                    return true
                })

            }
            else {
                bot.BotMsg(ChatId, error_messages["ERROR_NotANumber"])
            }
        }
        // DELETE
    }
    return false;
}

module.exports = {homeworkManageActivity, DataClass}