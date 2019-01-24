const IOTA = require('iota.lib.js')
const iota = new IOTA({ provider: 'https://altnodes.devnet.iota.org' })

const length = 243;
const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ9';
let seed = "";

for (let i = 0; i < length; i++) {
    seed += charset.charAt(Math.floor(Math.random() * charset.length));
}
console.log("seed: "+seed)
iota.api.getNewAddress(seed, [{"index":0, "total":3, "security":2}], (error, success) =>
{
    if (error) {
        console.log(error)
    } else {
        console.log("address: " + success)
    }
})
