# Specdrums
This project uses Sphero Specdrums, Javascript, and the Chrome Bluetooth API to create a way to play music with a tap of the Specdrums on different colors. 

# Specdrum Class
To be able to use Specdrums in your project you need to download Specdrums.js and place it in the same directory as your project. Then import the `Specdrum` class.
```javascript
import Specdrum from "./Specdrums.js"
```

You could then connect to a Specdrum by using the class's `connect()` function. A Promise is used to make sure to instantiate a new Specdrum only if one has successfully connected. Pass in the device information and the characteristics of the connected Specdrum for the new Specdrum object.
```javascript
//Try to connect to a new Specdrum 
Specdrum.connect().then(specdrum => {
   //Create a new specdrum instance for the one that was connected
   let spec = new Specdrum(specdrum.device, specdrum.characteristics);
  });
```

