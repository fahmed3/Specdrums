class MichaelMultiSynth {

    /* takes an args object as an argument, which includes key string and synth string */
    constructor(args){
        /* initialize Tone.Synth types */
        this.synth1Def = new Tone.Synth().toMaster();
        this.synth1FM = new Tone.FMSynth().toMaster();
        this.synth1AM = new Tone.AMSynth().toMaster();
        this.synth2Def = new Tone.PolySynth(3, Tone.Synth).toMaster();
        this.synth2FM = new Tone.PolySynth(3, Tone.FMSynth).toMaster();
        this.synth2AM = new Tone.PolySynth(3, Tone.AMSynth).toMaster();
        /* create synths object */
        this.synths = {
        /* each synths object contains an object for each synth type */
        /* and each subobject contains a Tone.synth (mono) and a Tone.PolySynth (poly) */
            default: {
                mono: new Tone.Synth().toMaster(),
                poly: new Tone.PolySynth(3, Tone.Synth).toMaster()
            },
            am: {
                mono: new Tone.AMSynth().toMaster(),
                poly: new Tone.PolySynth(3, Tone.AMSynth).toMaster()
            },
            fm: {
                mono: new Tone.FMSynth().toMaster(),
                poly: new Tone.PolySynth(3, Tone.FMSynth).toMaster()
            }
        }
        /* if user passes a key and a synth, set our this objects to the parameters. */
        /* if not, set default to this.key = "C" and this.synth = "default" */
        this.key = args.key || "C"; 
        this.synth = args.synth || "default";
        this.transpose;
        this.setKey(this.key);
    }

    setKey(keySet){
        if (keySet == "A"){
            this.transpose = -3;
            this.key = 'A';
        }
        else if (keySet == "B"){
            this.transpose = -1;
            this.key = 'B';
        }
        else if (keySet == "C"){
            this.transpose = 0;
            this.key = 'C';
        }
        else if (keySet == "D"){
            this.transpose = 2;
            this.key = 'D';
        }
        else if (keySet == "E"){
            this.transpose = 4;
            this.key = 'E';
        }
        else if (keySet == "F"){
            this.transpose = 5;
            this.key = 'F';
        }
        else if (keySet == "G"){
            this.transpose = 7;
            this.key = 'G';
        }
    }

    setSynth(synthSet){this.synth = synthSet;}

    attack(note, isChord){
        if (!isChord){
            this.synths[this.synth]["mono"].triggerAttack(new Tone.Frequency(note + this.transpose, "midi"));
            console.log("attack", note);
            console.log(this.synths[this.synth]["mono"])
        }
        else {
            let frequencies = note.map(n => new Tone.Frequency(n + this.transpose, "midi"));
            this.synths[this.synth]["poly"].triggerAttack(frequencies);
            console.log(note);
            console.log(frequencies);
        }
    }

    release(isChord){
        if (!isChord){
            this.synths[this.synth]["mono"].triggerRelease();
            console.log("release");
        }
        else this.synths[this.synth]["poly"].releaseAll();
    }
}

// mySynth = new MichaelMultiSynth({key: 'A', synth: 'default'});
// console.log(mySynth.key);
// console.log(mySynth.synth);
// mySynth.setKey('D');
// console.log(mySynth.key);
// mySynth.setSynth('fm');
// console.log(mySynth.synth);
// console.log(typeof(mySynth));
// // setTimeout(() => mySynth.attack(600, false), 1000);
// // setTimeout(() => mySynth.release(false), 2000);

// function testAttack(){
//     mySynth.attack([60, 63, 67], true);
//     setTimeout(() => mySynth.release(true), 2000);
// }