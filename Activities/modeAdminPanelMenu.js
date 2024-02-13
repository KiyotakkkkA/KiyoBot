const bot = require("../BotConfig/BOT")
const root = require("../BotConfig/ROOT")

const knex = require("../ExternalCommands/DatabaseUtility")
const Promise = require('bluebird')

const {error_messages, spec_symbols, info_messages} = require("../MessagesConfig/config_messages")
const {buttons} = require('../commandsConfig');
const {getGroupsList, addGroup} = require('../ExternalCommands/GetGroupsUtility')

var Settings = {
    __BLOCKED__: false
}

var admin_buttons = [
    [buttons.adminChangeModeOff, "Заблокировать пользователя [WIP]"],
    ["Сделать объявление [WIP]", buttons.adminGroupManagement],
    [buttons.backToMenu]
]

function checkPermission(text, msg, command, ChatId) {
    if (text == command && msg.from.id != root.__ROOT_ID__){
        bot.BotMsg(ChatId, error_messages['ERROR_NoPerm'])
        return false
    }

    if (text == command && msg.from.id == root.__ROOT_ID__){
        return true
    }

    return false
}

function enableBot(text, ChatId, msg){
    if (text == buttons.adminChangeModeOn && msg.from.id == root.__ROOT_ID__){
        Settings.__BLOCKED__ = false
        bot.BotMsg(ChatId, "[" + spec_symbols['SB_success'] + "] Бот включен...")
        return true
    }

    if (msg.from.id == root.__ROOT_ID__){
        bot.bot.sendMessage(ChatId, "[" + spec_symbols["SB_error"] + "] Бот неактивен", {
            reply_markup: {
            keyboard: [
                [buttons.adminChangeModeOn]
            ]
        }
        })

        return true
    }
    return false
}

function AdminPanelActivity(text, ChatId, msg){

    switch (text) {
        case (buttons.adminGroupManagement):
            bot.bot.sendMessage(ChatId, "Администрирование групп - выберите опцию", {
                reply_markup: {
                keyboard: [
                    [buttons.adminAddGroup, buttons.adminGroupsList],
                    [buttons.backToMenu]
                ]
            }
            })
            break
    
        case (buttons.adminGroupsList):
            getGroupsList(ChatId)
            break

        case (buttons.adminAddGroup):
            bot.BotMsg(ChatId, `${spec_symbols["SB_write"]} Введите название группы (воспользуйтесь опцией 'ответить' на это сообщение)`)
            addGroup(ChatId, msg)
            break
        
        case (buttons.mainMenuAdminPanel):
            if (msg.from.id != root.__ROOT_ID__){
                bot.BotMsg(ChatId, error_messages['ERROR_NoPerm'])
                return true
            }
            bot.bot.sendMessage(ChatId, "Админ-панель - выберите опцию", {
                reply_markup: {
                keyboard: admin_buttons
            }
            })
            break
    }

    if (checkPermission(text, msg, buttons.adminChangeModeOff, ChatId)) {
        Settings.__BLOCKED__ = !Settings.__BLOCKED__
        bot.BotMsg(ChatId, "[" + spec_symbols['SB_success'] + "] Бот выключен...")
        return true
    }
    
    if (msg.reply_to_message){
        if (msg.reply_to_message.text === `${spec_symbols["SB_write"]} Введите название группы (воспользуйтесь опцией 'ответить' на это сообщение)`)
        {
            if (typeof msg.text === "string"){
                Promise.all([knex('groups').insert({
                    name: msg.text,
                })]).then(data => {
                    bot.BotMsg(ChatId, info_messages['INFO_AddSuccess'])
                    return true
                }).catch(err => {
                    console.log(err)
                })
            }
            else {
                bot.BotMsg(ChatId, error_messages['ERROR_NotAString'])
                return false
            }

        }
    }
}

module.exports = {AdminPanelActivity, Settings, enableBot}