
/**
 * beaconViewModel
 */

var app = app || {};

app.Beacon = (function () {
    'use strict'
    
    // beacon view model
    var beaconViewModel = (function () {
        
        var start = function () {
            
            if (!this.checkSimulator()) {
                // note that you can also pass in a UUID, see the Verified Plugins Marketplace doc
                alert("Look now");
                win.estimote.startRanging("Telerik");
            }
        };

        
        var stop = function () {
            if (!this.checkSimulator()) {
                window.estimote.stopRanging();
            }
        };

        var checkSimulator= function() {
            if (window.navigator.simulator === true) {
                alert('This plugin is not available in the simulator.');
                return true;
            }
            else if (window.estimote === undefined) {
                alert('Plugin not found. Maybe you are running in AppBuilder Companion app which currently does not support this plugin.');
                return true;
            }
            else {
                return false;
            }
        };
       /*
        var onBeaconsReceived = function(result) {
            alert("Received");
            if (result.beacons && result.beacons.length > 0) {
                var msg = "Beacons found: " + result.beacons.length + "<br/>";
                for (var i = 0; i < result.beacons.length; i++) {
                    var beacon = result.beacons[i];
                    msg += "<br/>";
                    if (beacon.color !== undefined) {
                        msg += "Color: " + beacon.color + "<br/>";
                    }
                    if (beacon.macAddress !== undefined) {
                        msg += "Mac Address: " + beacon.macAddress + "<br/>";
                    }
                    msg += "Distance: " + beacon.distance + " m<br/>";
                    msg += "Major / Minor: " + beacon.major + " / " + beacon.minor + "<br/>";
                    msg += "Rssi: " + beacon.rssi + "<br/>";
                }
            }
        };*/
        
        return {
            
            start : start,
            stop : stop,
            checkSimulator: checkSimulator
            //,onBeaconsReceived: onBeaconsReceived
        };
    }());
    
    return beaconViewModel;
}());

// define a beacon callback function
function onBeaconsReceived(result) {
    alert("Received");
    if (result.beacons && result.beacons.length > 0) {
        var msg = "Beacons found: " + result.beacons.length + "<br/>";
        for (var i=0; i<result.beacons.length; i++) {
            var beacon = result.beacons[i];
            msg += "<br/>";
            if (beacon.color !== undefined) {
                msg += "Color: " + beacon.color + "<br/>";
            }
            if (beacon.macAddress !== undefined) {
                msg += "Mac Address: " + beacon.macAddress + "<br/>";
            }
            msg += "Distance: " + beacon.distance + " m<br/>";
            msg += "Major / Minor: " + beacon.major + " / " + beacon.minor + "<br/>";
            msg += "Rssi: " + beacon.rssi + "<br/>";
        }
        document.getElementById('beaconlog').innerHTML = msg;
    }
}
