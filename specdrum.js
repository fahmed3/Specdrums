let service1 = '00010001-574f-4f20-5370-6865726f2121'; //write
let service2 = '03b80e5a-ede8-4b33-a751-6ce34ec4c700'; //read
let service3 = '00001800-0000-1000-8000-00805f9b34fb';

let btn = document.getElementById("btn");
btn.addEventListener("click", connect);
function connect(){
    navigator.bluetooth.requestDevice({
	filters: [{
	    namePrefix: 'SD-'
	}],
	//acceptAllDevices: true,
	optionalServices: [service1, service2, service3]
    })
	.then(device => {
	    // Human-readable name of the device.
	    console.log(device.name);

	    // Attempts to connect to remote GATT Server.
	    return device.gatt.connect();
	})
	.then(server => {
	    // Getting Primary Service...
	    console.log("Getting primary service...");
	    return server.getPrimaryService(service2);
	})
	.then(service => {
	    //console.log("Service: ", service);
	    return service.getCharacteristics();
	})
	.then(characteristics => {
	    // Reading characteristics... 
	    console.log("Getting characteristics... ");
	    characteristics[0].startNotifications();
	    characteristics[0].addEventListener('characteristicvaluechanged', change);
	    return characteristics[0].readValue();
	})
	.catch(error => { console.log(error); });
}

function change(e){
    //let v = e.target.value.getUint8Array();
    let arr = new Uint8Array(event.target.value.buffer);
    console.log(arr);
    let pitch = arr[3];
    let velocity = arr[4];
    //if(velocity){ synth.attack(pitch); }
    //else { synth.release(); }
}

//[128, 128, 144, 60, 0, 64, 0, 67, 0]
//[.,.,., (midi, velocity), (), ()]
