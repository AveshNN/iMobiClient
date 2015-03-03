/**
 * ModallAlert view model
 */

var app = app || {};

app.Alert = (function () {
    'use strict';

    var alertViewModel = (function () {

        var openAlertWindow = function(title, message) {
            document.getElementById("alertStatus").innerHTML = message;
            document.getElementById("alertTitle").innerHTML = title;
            $("#modalview-Alert").kendoMobileModalView("open");  
        };
        
        var closeAlertWindow = function() {
            
            $("#modalview-Alert").kendoMobileModalView("close");  
            console.log("close");
        };
       
        return {
            openAlertWindow:openAlertWindow,
            closeAlertWindow:closeAlertWindow
        };
    }());

    return alertViewModel;
}());
