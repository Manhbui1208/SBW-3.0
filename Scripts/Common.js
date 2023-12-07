// Requiring module
const Web3 = require('web3')
const fs = require("fs");
const path = require('path')
const randomUrl = require("random-url")

module.exports = { 
    RNG_between: function (min, max) {  
        return Math.floor(
            Math.random() * (max - min) + min
        )
    },
    sleep: function (ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    },
    RNG_inputs: function (input, trig, len, num_inputs) {
        switch(input.type) {
            case 'bool':
                return Math.random() < 0.5;

            case 'int32':
                return module.exports.RNG_between(0, 2**16)

            case 'uint':
                return module.exports.RNG_between(0, 10)

            case 'uint64':
                return module.exports.RNG_between(0, 2**20)

            case 'uint256':
                return module.exports.RNG_between(0, 2**25)
            
            case 'uint256[]':
                let unit256_arr = new Array();
                let unit256_arr_length = trig ? len : module.exports.RNG_between(1, 10)
                for (let i = 0; i < unit256_arr_length; i++) {
                    unit256_arr[i] = module.exports.RNG_between(0, 2**25)
                }
                return unit256_arr

            case 'string':
                return module.exports.RNG_str(module.exports.RNG_between(0, 2**4))

            case 'address':
                return num_inputs == 1 ? '\'' + module.exports.RNG_addr() + '\'' : module.exports.RNG_addr()

            case 'address[]':
                let addr_arr = new Array();
                let addr_arr_length = trig ? len : module.exports.RNG_between(1, 10)
                for (let i = 0; i < addr_arr_length; i++) {
                    addr_arr[i] = module.exports.RNG_addr() 
                }
                return addr_arr

            case 'bytes':
                return trig ? Web3.utils.padLeft(Web3.utils.asciiToHex(module.exports.RNG_str(module.exports.RNG_between(0, 2**6))), len).slice(0, len) : Web3.utils.padLeft(Web3.utils.asciiToHex(module.exports.RNG_str(module.exports.RNG_between(0, 2**4))), 64) 

            case 'bytes32[]':
                let byte_arr = new Array();
                let byte_arr_length = trig ? len : module.exports.RNG_between(1, 10)
                for (let i = 0; i < byte_arr_length; i++) {
                    byte_arr[i] = Web3.utils.padLeft(Web3.utils.asciiToHex(module.exports.RNG_str(module.exports.RNG_between(0, 2**4))), 64) 
                }
                return byte_arr
            case 'URI':
                return randomUrl('https')
        }
    },
    RNG_str: function (length) {
        var result           = String();
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * 
            charactersLength));
       }
       return result;
    },
    RNG_addr: function () {
        // Read tx list
        const acc_lists = fs.readFileSync(__dirname + "/acc_list.csv", 'utf8');
        let acc_list    = acc_lists.split("\n")
        rnd             = module.exports.RNG_between(0, acc_list.length)
        return acc_list[rnd].split(",")[0]
    },
    Select_addr: function (pub_key) {
        // Read tx list
        const acc_lists = fs.readFileSync(__dirname + "/acc_list.csv", 'utf8');
        let acc_list    = acc_lists.split("\n")
        for (let i = 0; i < acc_list.length; i++) {
            if (acc_list[i].split(",")[0] == pub_key) {
                let acc         = {}
                acc.pub_key     = pub_key
                acc.pri_key     = acc_list[i].split(",")[1]
                return acc;
            }
        }
    },
    skip: function (num) {
        return new Array(num);
    },
    RNG_sm: function(name) {
        // RNG smart contract addr from SMs_addr DB
        let SM_addrs
        try{
            // Check if the DB file is existed
            if (fs.existsSync(path.join(__dirname, '../..', "/SC-based_attacks/RNG_Normal/Database/SMs_addr/" + name + ".csv"))) {
                SM_addrs    = fs.readFileSync(path.join(__dirname, '../..', "/SC-based_attacks/RNG_Normal/Database/SMs_addr/" + name + ".csv"), 'utf-8');
                SM_addrs    = SM_addrs.split("\n")
            }
        } catch (e) {
            console.log(e);
        }

        // Check invalid line in DB
        let invalid = true
        let res = {}
        while(invalid) {
            rng         = module.exports.RNG_between(0, SM_addrs.length)
            try {
                pub_key=SM_addrs[rng].split(',')[1]
                res.acc     = module.exports.Select_addr(pub_key)
                res.SM_addr = SM_addrs[rng].split(',')[0]
                if (pub_key.length == 42 && res.SM_addr.length == 42) {
                    invalid = false
                    return res
                }
            } catch (e) {
                console.log("Try to select another smart contract.")
            }
        }
    },
    shuffleArray: function(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array
    }
}