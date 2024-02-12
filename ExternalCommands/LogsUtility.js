var fs = require("fs")

function logger(msg, act){
    let dat = new Date()
    let string_date_ = String(dat.toLocaleDateString()).replace("/", ".")
    let string_date = string_date_.slice(0, -5)

    let log_ = `TIME: ${dat} - NAME: ${msg.from.username} - ID: ${msg.from.id} - ACTION: ${act}\n`

    fs.open(`./Logs/` + `${string_date}Logs.txt`, 'a+', (err) => {
        if(err) throw err;
    });

    fs.appendFile(`./Logs/` + `${string_date}Logs.txt`, log_, (err) => {
        if (err) throw err
    })
}

module.exports = {logger}