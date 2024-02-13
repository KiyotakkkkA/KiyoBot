const knex = require("./DatabaseUtility")
const Promise = require('bluebird')

const bot = require("../BotConfig/BOT")

const {day_modify} = require("../MessagesConfig/config_general")
const {info_messages} = require("../MessagesConfig/config_messages")
const {buttons} = require('../commandsConfig');

function knowHomework(chat, msg, target_id=''){
    Promise.props({
        group_id: knex.select('').from('peoples').where('tg_id', msg.from.id)
    }).then(ans => {
        Promise.props({
            data: knex.select('').from('homework').where('group_id', ans.group_id[0].group_id),
        }).then(data => {
            CreateResponce(data.data)
        }).catch(err => {
            console.log(err)
        })
    })

    function format(id, subj, text, date, complete){
        var ans = ''
        var comp = 'Выполнили: '
        ans += `ID - <b><em>${id}</em></b>\n`
        ans += `Предмет - <b><em>${subj}</em></b>\n`
        ans += `Задание - <b><em>${text}</em></b>\n`
        ans += `Крайний срок - <b><em>${date}</em></b>\n`
        for (let i in complete){
            if (complete[i].homework_id == id){
                comp += `\n- <b><em>${complete[i].people_name}</em></b>`
            }
        }
        if (comp == 'Выполнили: '){
            comp += 'НИКТО'
        }
        ans += comp

        return ans
    }

    function CreateResponce(x){
        Promise.props({
            hw: knex.select('').from('homework_complete')
        }).then(dt => {
            let end = ""
        // Homework info form
        for (let cell = 0; cell < x.length; cell++){
            if (target_id === ''){
                end += format(x[cell].id, x[cell].subj, x[cell].text, x[cell].date, dt.hw)
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
        })
    }

    return 
}

module.exports = {knowHomework}