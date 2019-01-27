const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mcpadc = require('mcp-spi-adc');
const IOTA = require('iota.lib.js')
const iota = new IOTA({ provider: 'https://altnodes.devnet.iota.org' });
let seed;
const elecPrice = 0.32;
const secondelecPrice = elecPrice/3600
http.listen(4444);
let baseline;
const tempSensor0 = mcpadc.open(0, {speedHz: 1350000}, (err) => {
    if (err) throw err;
    tempSensor0.read((err, reading) => {
        if (err) throw err;
        let average = 100;
        let span = 0.066
        let total = 0;
        for (let i = 0; i< average; i++){
            total += reading.value;
        }
        baseline = total/100
        baseline *=1000
        baseline += 5
        console.log(baseline)
    });
});
io.on('connection', (socket)=>{
    console.log("new user connected");
    socket.emit('message', { content: 'You are connected!', importance: '1' });

    socket.on('seedCharger', (data)=>{
        console.log(data)
        seed = data
        socket.emit('seedLoaded', {value: 'valid'});
    })
    socket.on('history', ()=>{
        console.log("fetching hist")
        iota.api.getTransfers(seed ,(error, success) => {
            if (error) {
                console.log("error")
                socket.emit('histmessage', { value:error});
            } else {
                console.log("done")
                socket.emit('histmessage', { value:success});
            }
        })
        socket.emit('seedLoaded', {value: 'valid'});
    })

    let totalAmps =0;
    let totalRuns = 0;
    let startTime = Date.now();
    let endTime = Date.now();
    let keepSwimming = false;
    let previousAmp=0
    const tempSensor = mcpadc.open(0, {speedHz: 1350000}, (err) => {
        if (err) throw err;
        iota.api.getNodeInfo((error, success) => {
            if (error) {
                console.log("error")
                console.log(error)
            } else {
                console.log("Started up fine")
                console.log(success)
                console.log(Date.now())
                console.log(new Date(Date.now() - startTime).getSeconds())
            }
        })

        setInterval(() => {
            tempSensor.read((err, reading) => {
                if (err) throw err;
                let average = 50;
                let offset = baseline;
                let span = 0.066
                let amps = 0;
                let total = 0;
                for (let i = 0; i< average; i++){
                    total += reading.value;
                }
                let averageRead = total/average;
                amps = averageRead;
                amps *= 1000;
                amps -= offset;
                amps *= span;
                amps  /=2;
                amps *= 100;
                amps = Math.round(amps);
                amps /= 100
                if(amps > 0.35){
                    if (totalRuns === 0){
                        console.log("started charging")
                        socket.emit('changeState', { state: 'start charging',});
                        startTime = Date.now();
                    }
                    totalAmps += amps
                    totalRuns +=1
                } else if(totalRuns != 0){
                    socket.emit('changeState', { state: "executing transfer",});
                    let averamp = (totalAmps/totalRuns)
                    let averageWatt = averamp*5
                    let totalSeconds = new Date(Date.now() - startTime).getSeconds()
                    let elecPrice = secondelecPrice * (averageWatt * totalSeconds);
                    ChargeUsage(seed,"you charged an average off: " + averageWatt + "W , in : " + totalSeconds+" Seconds and costs: "+ elecPrice, elecPrice )
                    console.log("you charged an average of: " + averageWatt + "W , in : " + totalSeconds+" Seconds and costs: "+ elecPrice)
                    totalAmps =0;
                    totalRuns = 0;
                    startTime = null;
                    endTime = null;
                    keepSwimming = false;
                    previousAmp=0
                }

            })
        }, 1000);
    });

    function ChargeUsage(SeedSeed, message, amount){
        console.log("start payment")
        let trytemessage = iota.utils.toTrytes(message)

        var tx1 = {
            'address': "HAPPHAHWJKYKTTVGUYUJGZYXFTWSLNKPSURGLRRFGUBBUAWRNFYQHCRZEFUVBFPKHYNJXCWKDDJYOKIAA", //81 trytes long address
            'value': Math.round(amount*10000),
            'message': trytemessage
        };
        let SeedSender= SeedSeed
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
                    socket.emit('changeState', { state: "Transfer done",});
                    console.log("\nIt has been sent.Now let's see transactions that were sent:");
                    console.log(r);

                }
            }
        );
    }
})
