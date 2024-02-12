const knex = require("./DatabaseUtility")
const Promise = require('bluebird')

const bot = require("../BotConfig/BOT")

const {day_modify} = require("../MessagesConfig/config_general")
const {info_messages} = require("../MessagesConfig/config_messages")
const {buttons} = require('../commandsConfig');

function knowHomework(chat, target_id=''){
    Promise.props({
        data: knex.select('').from('homework')
    }).then(data => {
        CreateResponce(data.data)
    })

    function format(id, subj, text, date, complete){
        if (complete == null || complete == "") complete = "Никто"
        var ans = ''
        ans += `ID - <b><em>${id}</em></b>\n`
        ans += `Предмет - <b><em>${subj}</em></b>\n`
        ans += `Задание - <b><em>${text}</em></b>\n`
        ans += `Крайний срок - <b><em>${date}</em></b>\n`
        ans += `Выполнили - <b><em>${complete}</em></b>\n\n`

        return ans
    }

    function CreateResponce(x){
        let end = ""
        // Homework info form
        for (let cell = 0; cell < x.length; cell++){
            if (target_id === ''){
                end += format(x[cell].id, x[cell].subj, x[cell].text, x[cell].date, x[cell].complete)
            }
            else{
                if (day_modify[String(x[cell].date).split(' ')[0].toLowerCase()] === target_id){
                    end += format(x[cell].id, x[cell].subj, x[cell].text, x[cell].date)
                }
            }
        }
        if (end === ''){
            end += info_messages["INFO_NoHomework"]
        }
        bot.bot.sendMessage(chat, `${end}`, {parse_mode: "html", reply_markup: {
            keyboard: [
                [buttons.homeworkAdd, buttons.homeworkKnow],
                [buttons.homeworkEdit, buttons.homeworkDelete],
                [buttons.backToMenu]
            ]
        }})
    }

    return 
}

module.exports = {knowHomework}