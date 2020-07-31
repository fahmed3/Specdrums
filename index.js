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
    /* When Specdrum connects, show GUI */
    let synth1 = document.getElementById("synth1");
    if (synth1.style.display == "none"){
        synth1.style.display = "block";
        let s = document.getElementById("settings1");
        s.innerHTML = spec.device.name + ": Settings";
        let keyDD = document.getElementById('dropdownKey1');
        let keySelect = document.getElementsByClassName('dropdown-item-key1');
        let synthDD = document.getElementById('dropdownSynth1');
        let synthSelect = document.getElementsByClassName('dropdown-item-synth1');
        for (let i = 0; i < keySelect.length; i++){
            keySelect[i].addEventListener("click", ()=>{
                alterKey(keySelect[i].text, multisynth);
                keyDD.innerHTML = "Key: " + keySelect[i].text;
            })
        }
        for (let i = 0; i < synthSelect.length; i++){
            synthSelect[i].addEventListener("click", ()=>{
                alterSynth(synthSelect[i].classList[2], multisynth);
                synthDD.innerHTML = "Synth: " + synthSelect[i].text;
            })
        }
    }
    else{
        synth2.style.display = "block";
        let s = document.getElementById("settings2");
        s.innerHTML = spec.device.name + ": Settings";
        let keyDD = document.getElementById('dropdownKey2');
        let keySelect = document.getElementsByClassName('dropdown-item-key2');
        let synthDD = document.getElementById('dropdownSynth2');
        let synthSelect = document.getElementsByClassName('dropdown-item-synth2');
        for (let i = 0; i < keySelect.length; i++){
            keySelect[i].addEventListener("click", ()=>{
                alterKey(keySelect[i].text, multisynth);
                keyDD.innerHTML = "Key: " + keySelect[i].text;
            })
        }
        for (let i = 0; i < synthSelect.length; i++){
            synthSelect[i].addEventListener("click", ()=>{
                alterSynth(synthSelect[i].classList[2], multisynth);
                synthDD.innerHTML = "Synth: " + synthSelect[i].text;
            })
        }
    }

    /* Key-Controlling Dropdown Menu */
    

    /* Synth-Controlling Dropdown Menu */
    
}

function alterKey(newKey, multisynth){
    multisynth.setKey(newKey);
}

function alterSynth(newSynth, multisynth){
    multisynth.setSynth(newSynth);
}
