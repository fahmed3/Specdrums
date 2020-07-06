import Specdrum from "./Specdrums.js"

let specdrum = new  Specdrum();


window.onConnect = function() {
    specdrum.connect();
}

specdrum.addEventListener("tap", tapped);
specdrum.addEventListener("release", released);

function tapped(e) {
    console.log("Tap");
    console.log(e.info);
}

function released(e) {
    console.log("Release");
}
