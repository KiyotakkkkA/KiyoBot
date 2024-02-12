const knex = require("./DatabaseUtility")
const Promise = require('bluebird')

const bot = require("../BotConfig/BOT")

const {day_modify} = require("../MessagesConfig/config_general")
const {info_messages, error_messages} = require("../MessagesConfig/config_messages")
const {buttons} = require('../commandsConfig');

function getGroupsList(ChatId){
    Promise.props({
        groups: knex.select('').from('groups'),
    }).then(data => {
        if (data.groups.length == 0){
            bot.bot.sendMessage(ChatId, error_messages['ERROR_NullDatabase'])
            return 
        }
        else{
            ans = '|Список групп|\n'
            for (let i in data.groups){
                ans += `ID - <b><em>${data.groups[i].id}</em></b>\n`
                ans += `Группа - <b><em>${data.groups[i].name}</em></b>\n`
                ans += `\n`
            }
            bot.BotMsg(ChatId, ans)
            return
        }
    })
}

module.exports = {getGroupsList}