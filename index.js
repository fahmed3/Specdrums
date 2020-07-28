import Specdrum from "./Specdrums.js"
import MichaelMultiSynth from "./MichaelMultiSynth.js"

let specdrums = {};

let btn = document.getElementById("btn");
btn.addEventListener("click", connectSpec);


//how to do success vs failure callback when the function returns before it even finishes connecting? Apparently promises only return other promises
//
//temporary fix by just having Specdrum.connect() return a promise which we just continue to run with
function connectSpec() {
    //console.log(multiSynth.key);
    Specdrum.connect()
	.then(success, failure)
	.catch(error => { console.log(error); });
}

function success(spec){
    let multiSynth = new MichaelMultiSynth();
    console.log("Connected New Specdrum: ", spec.device.name);
    specdrums[spec.device.id] = spec;
    //console.log(specdrums);
    console.log(spec);
    console.log("Success!");
    spec.addEventListener("tap", (e) => multiSynth.attack(e.note, e.isChord) );
    spec.addEventListener("tap", (e) => console.log("tapped") );
    spec.addEventListener("release", (e) => multiSynth.release(e.isChord) );
    createGUI(spec, multiSynth);
}

function failure() {
    console.log("Failed to connect");
}

function createGUI(spec, multisynth){
    //create new synth gui
    let synths = document.getElementById("synths");
    let p = document.createElement("p");
    p.innerHTML = spec.device.name;
    synths.append(p);
    //create gui elements
    //make sure sliders affect parameters of multisynth - volume    
}
