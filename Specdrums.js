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

    change(e){	
	let arr = new Uint8Array(event.target.value.buffer);
	//console.log(arr);
	if(arr[4] == 0) this._callEventListeners({type: 'release', info: arr});
	else this._callEventListeners({type: 'tap', info: arr});
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
