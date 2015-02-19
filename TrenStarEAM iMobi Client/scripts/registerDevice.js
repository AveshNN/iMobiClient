/**
 * RegisterDevice view model
 */

var app = app || {};
var displayControlEmail;

app.RegisterDevice = (function () {
    'use strict'

    var displayControldeviceName;
    var displayControldeviceId;
    var displayControldeviceOsVersion;
    var displayControldeviceOs;
    
    // RegisterDevice view model
    var registerDeviceViewModel = (function () {
        var show = function (e) {
            document.getElementById(displayControldeviceName).value = app.deviceInfo.deviceModel();
            document.getElementById(displayControldeviceId).value = app.getDeviceSecureUDID();
            document.getElementById(displayControldeviceOsVersion).value = app.deviceInfo.deviceOsVersion();
            document.getElementById(displayControldeviceOs).value = app.deviceInfo.deviceplatform();
        };
        
        var initial = function(x, y, z, a) {
            displayControldeviceName = x;
            displayControldeviceId = y;
            displayControldeviceOsVersion = z;
            displayControldeviceOs = a;
        };
        
        var sendDeviceData = function() {
            var userEmail = document.getElementById('email').value;
            
            if (userEmail.value == "") {
                app.hideLoading();    
                document.getElementById('status').innerHTML = "Email Required";
                var el = document.getElementById('status');
                var effect = kendo.fx(el).fadeOut().duration(6000);
                effect.play();
            }
            else {
                var data = "uuid=" + app.getDeviceSecureUDID() + "&userEmail=" + userEmail + "&deviceType=" + app.deviceInfo.deviceplatform();
            
                app.Service.ajaxCall("SendDeviceData", data, "app.RegisterDevice.callbackSendDeviceData");
            }
        };
        
        var callbackSendDeviceData = function(result) {
            var registrationSent = false;
            if (result == true) {
                document.getElementById('status').innerHTML = "Device Data Sent";
                $('#SendDeviceData').addClass('ui-disabled');
                registrationSent = true;
            }
            else {
                document.getElementById('status').innerHTML = "Device Data NOT Sent";
            }
    
            var el = document.getElementById('status');
            var effect = kendo.fx(el).fadeOut().duration(6000);
            effect.play();
            
            
            $('#SendDeviceData').removeClass('ui-disabled');
            if (registrationSent) {
                document.location.href = "#view-transitions";
                document.getElementById('deviceStatus').innerHTML = "Registration Pending";
                $('#btnLogin').text('Reload');
                
            }
        };
        
        return {
            init : initial,
            show : show,
            sendDeviceData: sendDeviceData, 
            callbackSendDeviceData: callbackSendDeviceData
        };
    }());
    
    return registerDeviceViewModel;
}());
