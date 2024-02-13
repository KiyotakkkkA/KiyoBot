const bot = require("../BotConfig/BOT")

const Promise = require('bluebird')
const knex = require("../ExternalCommands/DatabaseUtility")
const homeW = require("../ExternalCommands/GetHomeworkUtility")

const {buttons} = require('../commandsConfig');
const {error_messages, spec_symbols, info_messages} = require("../MessagesConfig/config_messages")

function profileActivity(text, ChatId, msg){
    if (text == "Профиль"){
        Promise.props({
            people: knex.select('').from('peoples').where('tg_id', msg.from.id)
        }).then(data => {
            if (data.people.length == 0){
                bot.bot.sendMessage(ChatId, 'Профиль - Выбери опцию:', {
                    reply_markup: {
                        keyboard: [
                            [buttons.profileRegister],
                            [buttons.backToMenu]
                        ]
                    }
                })
                return false
            }
            else {
                bot.bot.sendMessage(ChatId, 'Профиль - Выбери раздел:', {
                    reply_markup: {
                        keyboard: [
                            [buttons.profileRating, buttons.profileCheckHomework],
                            [buttons.backToMenu]
                        ]
                    }
                })
                return true
            }
        }).catch(err => {
            console.log(err)
        })
        return true
    }

    if (text == "Зарегистрироваться"){
        bot.BotMsg(ChatId, `|${spec_symbols["SB_write"]} Введите данные о себе (воспользуйтесь опцией 'ответить' на это сообщение)`)
        bot.BotMsg(ChatId, `Формат:\n<b>ИМЯ | ГРУППА</b>\nНапример:\n<b>Сидоров С. | АААА-12-23</b>\nНазвание группы уточните у администратора или старосты`)
        return true
    }

    if (msg.reply_to_message) { 
        if (msg.reply_to_message.text == `|${spec_symbols["SB_write"]} Введите данные о себе (воспользуйтесь опцией 'ответить' на это сообщение)`){
            const data = text.split(' | ')
            Promise.props({
                ans: knex.select('').from('groups').where('name', data[1])
            }).then(ans => {
                if (ans.ans.length == 0){
                    bot.BotMsg(ChatId, error_messages['ERROR_GroupNotFound'])
                    return false
                }
                else {
                    Promise.all([
                        knex('peoples').insert({
                            name: data[0],
                            group_id: ans.ans[0].id,
                            score: 0,
                            tg_id: msg.from.id

                        })
                    ]).then(dt => {
                        bot.BotMsg(ChatId, info_messages['INFO_RegSuccess'])
                        return true
                    }).catch(err => {
                        console.log(err)
                    })
                }
            }).catch(err => {
                console.log(err)
            })
            }
        }

    if (msg.reply_to_message) {
        if (msg.reply_to_message.text == `[${spec_symbols["SB_success"]}] Какое по номеру задание вы выполнили?\n (воспользуйтесь опцией 'ответить' на это сообщение)`){
            id = Number(text)
            if (id){
                // db_.DbGetData('rating').then(r => getName(r, msg, id, ChatId));
                Promise.props({
                    people: knex.select('').from('peoples').where('tg_id', msg.from.id),
                    rej: knex.select('').from('homework_complete').where('homework_id', id).andWhere('people_id', msg.from.id) 
                }).then(data => {
                    if (data.rej.length == 0){
                        Promise.all([
                            knex('homework_complete').insert({
                                homework_id: id,
                                people_name: data.people[0].name,
                                people_id: data.people[0].tg_id
                            }),
                            knex('peoples').where('tg_id', msg.from.id).update({
                                score: data.people[0].score + 1
                            })
                        ]).then(dt => {
                            bot.BotMsg(ChatId, "[" + spec_symbols['SB_success'] + "] Поздравляем! Вам начислено 1 очко!")
                            return true
                        })
                    }
                    else{
                        bot.BotMsg(ChatId, error_messages['ERROR_CompletedTask'])
                        return false
                    }
                }).catch(err => {
                    console.log(err)
                })
                return true
        
            }
            else {
                bot.BotMsg(ChatId, error_messages["ERROR_NotANumber"])
            }
        }
    }

    if (text == "Таблица рейтинга"){
        Promise.props({
            peoples: knex.select('').from('peoples')
        }).then(data => {
            let ans = "| Таблица Рейтинга |\n\n"
            for (let i in data.peoples) {
                ans += `<b>${data.peoples[i].id}</b>. <u>${data.peoples[i].name}</u> - [${data.peoples[i].score}]\n`
            }
            bot.BotMsg(ChatId, ans)
            return
        }).catch(err => {
            console.log(err)
        })
        return true
    }
    if (text == "Сообщить о выполнении ДЗ"){
        bot.BotMsg(ChatId, `[${spec_symbols["SB_success"]}] Какое по номеру задание вы выполнили?\n (воспользуйтесь опцией 'ответить' на это сообщение)`)
        homeW.knowHomework(ChatId, msg)
        return true
        
    }


    return false;
}

module.exports = {profileActivity}