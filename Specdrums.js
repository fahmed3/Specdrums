class Specdrum {    
    constructor(device, characteristics){

	Specdrum.specdrums = {};

	this.events = [] //event listeners

	this.device = device;
	this.characteristics = characteristics;
	
    }

    static connect(){
	let self = this;

	//variables for adding a new specdrum later, may not need device ID
	let newDevice;
	let newDeviceID;
	return navigator.bluetooth.requestDevice({
	    filters: [{
		namePrefix: 'SD-'
	    }],
	    optionalServices: [Specdrum.service1, Specdrum.service2]
	})
	    .then(device => {
		// Human-readable name of the device.
		console.log("Name: ", device.name);
		console.log("Device info: ", device);

		newDevice = device;
		newDeviceID = device.id;

		// Attempts to connect to remote GATT Server.		
		return device.gatt.connect();
	    })
	    .then(server => {
		// Getting Primary Service...
		console.log("Getting primary service...");
		return server.getPrimaryService(Specdrum.service2);
	    })
	    .then(service => {
		//console.log("Service: ", service);
		return service.getCharacteristics();
	    })
	    .then(characteristics => {
		// Reading characteristics... 
		console.log("Getting characteristics... ");
		return self.connectASpecdrum(newDevice, characteristics);		
	    })
	    .catch(error => { console.log(error); });
	//console.log("new device: ", Specdrum.specdrums[newDeviceID]);
    }



    /**
     * Function dealing with information received from the specdrum. It parses 
     * the array to see if it was a note or a chord, and to see if the specdrum 
     * was tapped or released, information it passes to event listeners.
     *
     * @param {event} e
     */    
    change(e){	
        let chord;
        let pitch;
        let arr = new Uint8Array(event.target.value.buffer);
        //console.log(arr);
        if (arr.length == 5){
            chord = false;
            pitch = arr[3];
        }
        else if (arr.length == 9){
            chord = true;
            let pitch1 = arr[3]
            let pitch2 = arr[5]
            let pitch3 = arr[7]
            pitch = [pitch1, pitch2, pitch3];
        }
        if(arr[4] == 0) this._callEventListeners({type: 'release', note: pitch, isChord: chord});
        else this._callEventListeners({type: 'tap', note: pitch, isChord: chord});
    }

    /**
     * Function allowing the user to define custom event listeners to be called
     * when a Specdrum instance triggers an event. Events are called in the
     * order with which they were added.
     *
     * eventType must be one of the following:
     * - '*' - connect or disconnect
     * - 'connect'
     * - 'disconnected'
     * - 'tap'
     * - 'release'
     *
     * @param {string} eventType
     * @param {function} func
     * @param {...*} args
     * @returns {boolean}
     */    
    addEventListener(eventType, func, ...args) {
        if (typeof func !== "function") {
            throw "second argument must be a valid function";
            return false;
        }
        if (!Specdrum.eventTypes.includes(eventType)) {
            throw "event type must be valid"; // list event types
            return false;
        }

        let newEvent = {'eventType': eventType, 'func': func, 'args': args};
        this.events.push(newEvent);
        return true;
    }    

    
    /**
     * Removes a callback function from the events list preventing further calls.
     *
     * @param {string} eventType
     * @param {function} func
     * @returns {boolean}
     */
    removeEventListener(eventType, func) {
        this.events = this.events.filter(ev => (ev.eventType != eventType || ev.func != func));
        return true;
    }

    /**
     * Iterates through the events list and upon ANY TinkaCore event, calls
     * the relevent functions.
     *
     * @param {string} event
     * @returns {boolean}
     * @private
     */
    _callEventListeners(event) {
        for (let evObj of this.events) {
            if (evObj.eventType == '*' || evObj.eventType == event.type)
                evObj.func(event, ...evObj.args);
        }
    }
    
    /**
     * Function to create a new specdrum and add it to the specdrums dictionary
     *
     * @param {object} device
     * @param {object} characteristics
     * @returns {string}
     */    
    static connectASpecdrum(device, characteristics){
	let newSpec = new Specdrum(device, characteristics);
	
	newSpec.characteristics[0].startNotifications();


	let bound_change = (function(event) {
            newSpec.change(event)
        }).bind(newSpec);	
	newSpec.characteristics[0].addEventListener('characteristicvaluechanged', bound_change);

	let bound_disconnected = (function(event) {
            newSpec.disconnected(event)
        }).bind(newSpec);	
	newSpec.device.addEventListener('gattserverdisconnected', bound_disconnected);

	newSpec._callEventListeners({type: 'connect'});	
	Specdrum.specdrums[device.id] = newSpec;

	return Specdrum.specdrums[device.id];
    }

    disconnected(){
	console.log(this.device.name + " has been disconnected.");
	this._callEventListeners({type: 'disconnected', info: arr});
    }
    
};

//static variables of the class
Specdrum.eventTypes = ['*', 'connect', 'disconnected', 'tap', 'release'];
Specdrum.service1 = '00010001-574f-4f20-5370-6865726f2121'; //write
Specdrum.service2 = '03b80e5a-ede8-4b33-a751-6ce34ec4c700'; //notify

//dict of specdrums



export default Specdrum;
