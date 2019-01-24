const mcpadc = require('mcp-spi-adc');

const tempSensor = mcpadc.open(0, {speedHz: 1350000}, (err) => {
    if (err) throw err;

    setInterval(() => {
        tempSensor.read((err, reading) => {
            if (err) throw err;
            let average = 10;
            let offset = 755;
            let span = 0.066
            let amps = 0;
            let total = 0;
            for (let i = 0; i< average; i++){
                total += reading.value;
            }
            amps = total/average;
            amps *= 1000;
            amps -= offset;
            amps *= span;
            console.log("amps: " +Math.round((amps/2)*100) / 100+" reading: " + reading.value+"watt: " +(Math.round((amps/2)*100) / 100)*5);
        });
    }, 1000);
});

