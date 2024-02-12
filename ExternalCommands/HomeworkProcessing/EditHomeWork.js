const bot = require("../../BotConfig/BOT")
const logg = require("../LogsUtility")
const knex = require("../DatabaseUtility")
const Promise = require('bluebird');

const {error_messages, spec_symbols} = require("../../MessagesConfig/config_messages")
const {day_modify} = require("../../MessagesConfig/config_general")

function EditHWProcessing(msg, ChatId){
    var dc = require("../../Activities/modeHomeworkMenu")
    
    if (msg.reply_to_message.text === `${spec_symbols["SB_edit"]} Выбери ID нужной записи (воспользуйтесь опцией 'ответить' на это сообщение)`)
    {
        dc.DataClass.setIdValue(Number(msg.text))
        if (dc.DataClass.id_){
            bot.BotMsg(ChatId, `${spec_symbols["SB_edit"]} Редактирование предмета (воспользуйтесь опцией 'ответить' на это сообщение)`)
        }
        else {
            bot.BotMsg(ChatId, error_messages["ERROR_NotANumber"])
            return 0
        }

    }
    if (msg.reply_to_message.text === `${spec_symbols["SB_edit"]} Редактирование предмета (воспользуйтесь опцией 'ответить' на это сообщение)`)
    {
        if (typeof msg.text === "string"){
            dc.DataClass.setSubjectValue(msg.text)
            bot.BotMsg(ChatId, `${spec_symbols["SB_edit"]} Редактирование задания (воспользуйтесь опцией 'ответить' на это сообщение)`)
        }
        else {
            bot.BotMsg(ChatId, error_messages['ERROR_NotAString'])
            return 0
        }
    }
    if (msg.reply_to_message.text === `${spec_symbols["SB_edit"]} Редактирование задания (воспользуйтесь опцией 'ответить' на это сообщение)`)
    {
        if (typeof msg.text === "string"){
            dc.DataClass.setTaskValue(msg.text)
            bot.BotMsg(ChatId, `|${spec_symbols["SB_edit"]} Редактирование даты (воспользуйтесь опцией 'ответить' на это сообщение)`)
            bot.BotMsg(ChatId, `|${spec_symbols["SB_edit"]} Формат - день недели словом\n|${spec_symbols["SB_edit"]} [Например: пятница]\n\n|${spec_symbols["SB_edit"]} Стандартный срок - 1 неделя\n|${spec_symbols["SB_edit"]} Для изменения воспользуйтесь\n|${spec_symbols["SB_edit"]} суффиксом +[N]нед, где N - число недель\n|${spec_symbols["SB_edit"]} [Например: среда +2нед]`)   
        }
        else {
            bot.BotMsg(ChatId, error_messages['ERROR_NotAString'])
            return 0
        }
    }
    if (msg.reply_to_message.text === `|${spec_symbols["SB_edit"]} Редактирование даты (воспользуйтесь опцией 'ответить' на это сообщение)`)
    {
        if (typeof msg.text === "string"){

            if (msg.text.includes("+")){
                var data_arr = msg.text.split("+")
                var format_day = String(data_arr[0]).replace(' ', '').toLowerCase()
                var format_offset = Number(String(data_arr[1]).replace('нед', '')) * 7

            }
            else {
                var format_day = msg.text
                var format_offset = 7
            }

            if (format_day in day_modify){
                const today_ = new Date();

                let day_id = day_modify[format_day]
                let total_day_offset = day_id - (today_.getDay() - 1)

                today_.setDate(today_.getDate() + format_offset + total_day_offset)

                dc.DataClass.setDateValue(`${format_day} ${today_.toLocaleDateString()}`)


                Promise.all([knex('homework').where('id', dc.DataClass.id_).update({
                    subj: dc.DataClass.subject_,
                    text: dc.DataClass.task_,
                    date: dc.DataClass.date_,
                })]).then(data => {
                    logg.logger(msg, 'Изменил задание')
                    bot.BotMsg(ChatId, `[${spec_symbols["SB_success"]}] Пользователь <u>${msg.from.first_name}</u> успешно изменил задание`)
                    return 1
                })
            }
            else{
                bot.BotMsg(ChatId, error_messages['ERROR_WrongForm'])
            }

        }
        else {
            bot.BotMsg(ChatId, error_messages['ERROR_NotAString'])
            return 0
            
        }
    }
}
module.exports = {EditHWProcessing}