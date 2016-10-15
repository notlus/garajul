"use strict";

var Gpio = require('pigpio').Gpio;

const relayPin = 21
const switchPin = 23

console.log("Setting mode");

// Initialize the relay that triggers the door to open/close.
var doorRelay = new Gpio(relayPin, {mode: Gpio.OUTPUT});

// Initialize the switch that monitors the door's open/close state.
var doorSwitch = new Gpio(switchPin, {mode: Gpio.INPUT,
				      pullUpDown: Gpio.PUD_UP,
				      edge: Gpio.EITHER_EDGE});

doorSwitch.on('interrupt', function (level) {
    //    led.digitalWrite(level);
    console.log("Detected switch state change, level=" + level);
});

var doorOpened = false;

var openDoor = function(continuation) {
    var opened = false
    
    if (!doorOpened) {
	console.log("Opening door");

	triggerDoor(function() {
	    console.log("Open trigger complete");
	    
	    doorOpened = true;
	});
    }
    else {
	console.log("Door already opened");
	opened = true;
	continuation(opened);
    }

    return opened;
}

var closeDoor = function() {
    var closed = true;;

    if (doorOpened) {
	console.log("Closing door");
	triggerDoor(function() {
	    console.log("Close trigger complete")
	    doorOpened = false;
	});
    }

    return closed;
}

var triggerDoor = function(completion) {
    doorRelay.digitalWrite(false);
    setTimeout(function() {
	console.log("Trigger complete");
	doorRelay.digitalWrite(true);
	completion();
    }, 3000);
}

var doorOpened = function() {
    doorOpened = doorSwitch.digitalRead();
    console.log("Door status, closed=" + doorOpened);
    return doorOpened;
}

module.exports.openDoor = openDoor;
module.exports.closeDoor = closeDoor;
module.exports.status = doorOpened;
