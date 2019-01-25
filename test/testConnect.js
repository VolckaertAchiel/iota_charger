const IOTA = require('iota.lib.js')
const iota = new IOTA({ provider: 'https://trinity.iota-tangle.io:14265' })


console.log("trying to connect, please wait...")
iota.api.getNodeInfo((error, success) => {
    if (error) {
        console.log("error")
        console.log(error)
    } else {
        console.log("connected")
        console.log(success)
    }
})
