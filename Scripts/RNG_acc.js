// Requiring module
const fs = require("fs");
const {RNG_between} = require("./Common")

// Read tx list
const acc_lists = fs.readFileSync(__dirname + "/acc_list.csv", 'utf8');
let acc_list    = acc_lists.split("\n")

module.exports = { 
    RNG_acc: function () {
        let acc         = {};
        rnd             = RNG_between(0, acc_list.length)
        acc.pub_key     = acc_list[rnd].split(",")[0]
        acc.pri_key     = acc_list[rnd].split(",")[1]
        return acc;
    },
    Select_acc: function (pub_key) {
        for (let i = 0; i < acc_list.length; i++) {
            if (acc_list[i].split(",")[0] == pub_key) {
                let acc         = {}
                acc.pub_key     = pub_key
                acc.pri_key     = acc_list[i].split(",")[1]
                return acc;
            }
        }
    }
}