if(window.localStorage.getItem('seed')){
    document.getElementById("seed").value = window.localStorage.getItem('seed')

}
document.getElementById("connect").addEventListener("click",seedCharger);
document.getElementById("history").addEventListener("click",history);
document.getElementById("back").addEventListener("click",back);


let obj = {
    state: '0%'
};

let myAnimation = anime({
    targets: obj,
    battery: '100%',
    round: true,
    easing: 'linear',
    duration: 15000,
    loop: false,
})

let socket = io('http://192.168.43.243:4444');
socket.on('connect', function(){
    console.log("connected")
});
socket.on('histmessage', function(message) {
    console.table(message);
    reset()
    document.getElementsByClassName("c-main-section__data")[0].style.display="block"
    document.getElementsByClassName("c-content")[0].innerHTML = (message.value)
});
socket.on('changeState', function(message) {
    console.log(message.state)
    switch(message.state){
        case 'Transfer done':
            transferDone()
            break;
        case 'executing transfer':
            executeTransfer()
            break;
        case 'start charging':
            startCharging()
            break;
    }
});
socket.on('seedLoaded', function(message) {
    console.log(message)
    if(message.value ==="valid"){
        reset();
        document.getElementsByClassName("c-main-section__battery")[0].style.display = "flex";
        document.getElementsByClassName("lds-ellipsis")[0].style.display="inline-block"
        document.getElementById("state").innerHTML = "{ state: 'Plugin phone' }"
    };
});
function history(){
    reset()
    socket.emit("history");
    document.getElementsByClassName("c-main-section__battery")[0].style.display = "flex";
    document.getElementsByClassName("lds-ellipsis")[0].style.display="inline-block"
    document.getElementById("state").innerHTML = "{ state: 'retreiving history' }"
}
function startCharging(){
    reset()
    document.getElementsByClassName("c-main-section__battery")[0].style.display = "flex";
    document.getElementsByClassName("bar")[0].style.display="block"
    document.getElementById("state").innerHTML = "{ state: 'Charging phone' }"
}
function executeTransfer(){
    reset()
    document.getElementsByClassName("c-main-section__battery")[0].style.display = "flex";
    document.getElementsByClassName("lds-ellipsis")[0].style.display="inline-block"
    document.getElementById("state").innerHTML = "{ state: 'Executing Transfer' }"
}
function transferDone(){
    reset()
    document.getElementsByClassName("c-main-section__battery")[0].style.display = "flex";
    document.getElementById("state").innerHTML = "{ state: 'Transfer done' }"
}
function seedCharger(){
    let seed= document.getElementById("seed").value;
    console.log(seed)
    window.localStorage.setItem('seed', seed);
    reset()
    document.getElementsByClassName("c-main-section__battery")[0].style.display = "flex";
    document.getElementsByClassName("lds-ellipsis")[0].style.display="inline-block"
    document.getElementById("state").innerHTML = "{ state: 'Plugin phone' }"

    socket.emit("seedCharger", seed)
}
function back(){
    reset()
    document.getElementsByClassName("c-main-section__battery")[0].style.display = "flex";
    document.getElementsByClassName("lds-ellipsis")[0].style.display="inline-block"
    document.getElementById("state").innerHTML = "{ state: 'Plugin phone' }"
}
function reset(){
    document.getElementsByClassName("c-main-section")[0].style.display = "none";
    document.getElementsByClassName("c-main-section__data")[0].style.display = "none";
    document.getElementsByClassName("c-main-section__battery")[0].style.display = "none";
    document.getElementsByClassName("bar")[0].style.display = "none"
    document.getElementsByClassName("lds-ellipsis")[0].style.display="none"
}

