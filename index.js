import Specdrum from "./Specdrums.js"
import MichaelMultiSynth from "./MichaelMultiSynth.js"

let specdrums = {};

let btn = document.getElementById("btn");
btn.addEventListener("click", connectSpec);

let multiSynth;


//how to do success vs failure callback when the function returns before it even finishes connecting? Apparently promises only return other promises
//
//temporary fix by just having Specdrum.connect() return a promise which we just continue to run with
function connectSpec() {
    multiSynth = new MichaelMultiSynth();
    //console.log(multiSynth.key);
    Specdrum.connect()
	.then(success, failure)
	.catch(error => { console.log(error); });
}

function success(spec){
    console.log("Connected New Specdrum: ", spec.device.name);
    specdrums[spec.device.id] = spec;
    //console.log(specdrums);
    console.log(spec);
    console.log("Success!");
    spec.addEventListener("tap", tapped);
    spec.addEventListener("release", released);	   
}
function failure() {
    console.log("Failed to connect");
}

//specdrum.addEventListener("tap", tapped);
//specdrum.addEventListener("release", released);

function tapped(e) {
    console.log("Tap");
    multiSynth.attack(e.note, e.isChord);
}

function released(e) {
    console.log("Release");
    multiSynth.release(e.isChord);
}
