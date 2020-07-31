class MichaelMultiSynth {

    /* takes an args object as an argument, which includes key string and synth string */
    constructor(args = {key: "C", synth: "default"}){
        /* each synths object contains an object for each synth type */
        this.synths = {
        /* and each subobject contains a Tone.Synth (mono) and a Tone.PolySynth (poly) */
            default: {
                mono: new Tone.Synth().toDestination(),
                poly: new Tone.PolySynth(Tone.Synth, {maxPolyphony:3}).toDestination()
            },
            am: {
                mono: new Tone.AMSynth().toDestination(),
                poly: new Tone.PolySynth(Tone.AMSynth).toDestination()
            },
            fm: {
                mono: new Tone.FMSynth().toDestination(),
                poly: new Tone.PolySynth(Tone.FMSynth).toDestination()
            }
        }
        /* if user passes a key and a synth, set our this objects to the parameters. */
        /* if not, set default to this.key = "C" and this.synth = "default" */
        this.key = args.key || "C"; 
        this.synth = args.synth || "default";
        this.transpose;
        this.setKey(this.key);
        this.setSynth(this.synth);
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

    setSynth(synthSet){
        this.synth = synthSet;
    }

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

export default MichaelMultiSynth;
