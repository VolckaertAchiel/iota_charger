const IOTA = require('iota.lib.js')
const iota = new IOTA({ provider: 'https://altnodes.devnet.iota.org' })


const seed ='' //Seed you want to search
console.log("lookup started, this can take a while")
iota.api.getAccountData(seed ,(error, success) => {
    if (error) {
        console.log("error")
        console.log(error)
    } else {
        console.log("success")
        console.log(success)
    }
})
