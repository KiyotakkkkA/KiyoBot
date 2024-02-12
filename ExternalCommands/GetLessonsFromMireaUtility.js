const axi = require("axios");
const {day_modify, pairs_time} = require("../MessagesConfig/config_general")

var cash = ['', '', '', '', '', '']

async function request(){
    const {data} = await axi.get("https://mirea.xyz/api/v1.3/groups/certain?name=ИНБО-31-23");
    let end_response = '';
    let pair_between_response = '';

    Date.prototype.getWeek = function() {
        var onejan = new Date(this.getFullYear(), 0, 1);
        return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
    }
    var weekNumber = (new Date()).getWeek();
    var current_day_lessons;

    for (let i = 0; i < 6; i++) {
        const lessons = data[0]["schedule"];

        if (weekNumber % 2 == 0) {
            current_day_lessons = lessons[i]["even"]
        }
        else {
            current_day_lessons = lessons[i]["odd"]
        }

        let title = lessons[i]["day"];

        pair_between_response = `<b>- ${title} -</b>\n`;

        for (let j = 0; j < current_day_lessons.length; j++) {
            if (current_day_lessons[j].length > 0) {
                let cdl = current_day_lessons[j][0];
                if (i === 4 && cdl["name"] === 'Физика') {
                    pair_between_response +=
                        `Расписание лабораторных работ уточняйте в Ninja Mirea\n`;
                } 
                else {
                    pair_between_response +=
                        `<u>${pairs_time[j]}</u> | ${cdl["name"]} [${cdl["type"]}] - ${cdl["place"]}\n`;
                }
            }
        }

        end_response = (pair_between_response + "\n");
        pair_between_response = '';
        cash[i] = end_response
    }

}

request()

async function getData(_txt_) {
    let day_id;

    for (let md in day_modify) {
        if (_txt_.includes(md)) {
            day_id = day_modify[md];
            end_response = cash[day_id]
            return ("| Расписание |\n" + end_response);
        }
    }
}

module.exports = {getData}