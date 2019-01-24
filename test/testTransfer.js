const IOTA = require('iota.lib.js')
const iota = new IOTA({ provider: 'https://altnodes.devnet.iota.org' })

var tx1 = {
    'address': "", //81 trytes long destination
    'value': 5,
    'tag': 'HRIBEK999IOTA999TUTORIAL', //Up to 27 trytes
    message: iota.utils.toTrytes('Hello world!')

};
let SeedSender= "" //seed from the sender
// Sending the iotas
console.log("\nSending iotas... Please wait...");

iota.api.sendTransfer(
    SeedSender, //Sender's seed
    3, //depth
    14, // MWM; in case of Devnet it is 9
    [tx1], // one transaction defined above.It is an output TX that adds tokens
    {
        "inputs": null, // you may be wondering why there is imputs = None and change_address = None.
        "address": null // It means it will be taken care by library and so make sure correct seed / security level was added while api initialization
    },
    function (e, r) {
        if (e) {
            console.log("Something went wrong: %s", e);
        }
        else {
            console.log("It has been sent.Now let's see transactions that were sent:");
            console.log(r);
        }
    }
);
