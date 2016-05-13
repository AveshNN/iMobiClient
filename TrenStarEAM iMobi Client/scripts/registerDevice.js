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
        
        var registerValidateEmailAndGenerateOTP = function() {
            var userEmail = document.getElementById('email').value;
            
            if (userEmail === "") {
                document.getElementById('status').innerHTML = "Email Required";
                var el = document.getElementById('status');
                var effect = kendo.fx(el).fadeOut().duration(3000);
                effect.play();
            }
            else {
                var data = "uuid=" + app.getDeviceSecureUDID() + "&userEmail=" + userEmail + "&deviceType=" + app.deviceInfo.deviceplatform();
            
                app.Service.ajaxCall("RegisterValidateEmailAndGenerateOTP", data, "app.RegisterDevice.callbackRegisterValidateEmailAndGenerateOTP", "Validation Email");
            }
        };
        
        var callbackRegisterValidateEmailAndGenerateOTP = function(result) {
            if (result == true) {
                $("#modalview-OTP").kendoMobileModalView("open");  
            }
        };
        
        var registerValidateOTP = function() {
            var otp = document.getElementById('otp').value;
            
            if (otp === "") {
                document.getElementById('statusOTP').innerHTML = "OTP Required";
                var el = document.getElementById('statusOTP');
                var effect = kendo.fx(el).fadeOut().duration(3000);
                effect.play();
            }
            else {
                var data = "uuid=" + app.getDeviceSecureUDID() + "&otp=" + otp;
            
                app.Service.ajaxCall("RegisterValidateOTP", data, "app.RegisterDevice.callbackRegisterValidateOTP", "Validating OTP");
            }
        };
        
        var callbackRegisterValidateOTP = function(result) {
            if (result === true) {
                app.RegisterDevice.closeOTPWindow();
                
                document.location.href = "#view-transitions";
                //$('#btnLogin').text('Not Approved - Reload');
            }
            else {
                document.getElementById('statusOTP').innerHTML = "Invalid OTP";
                var el = document.getElementById('statusOTP');
                var effect = kendo.fx(el).fadeOut().duration(3000);
                effect.play();
            }
        };
        
        var requestNewOTP = function() {
            var data = "uuid=" + app.getDeviceSecureUDID() + "&userEmail=" + "" + "&deviceType=" + "";
            
            app.Service.ajaxCall("RegisterValidateEmailAndGenerateOTP", data, "app.RegisterDevice.callbackRequestNewOTP", "Requesting OTP");
        };
        
        var callbackRequestNewOTP = function(result) {
            document.getElementById('otp').value = "";
            if (result == true) {
                document.getElementById('statusOTP').innerHTML = "New OTP sent";
                var el = document.getElementById('statusOTP');
                var effect = kendo.fx(el).fadeOut().duration(3000);
                effect.play();
            }
            else {
                document.getElementById('statusOTP').innerHTML = "Please try again";
                var el = document.getElementById('statusOTP');
                var effect = kendo.fx(el).fadeOut().duration(3000);
                effect.play();
            }
        };
        
        var closeOTPWindow = function() {
            $("#modalview-OTP").kendoMobileModalView("close");
            var UDID = app.getDeviceSecureUDID();
                app.Login.ValidateSecureUUID(UDID, "DEF");
        };
        
        var cancelOTPWindow = function() {
            $("#modalview-OTP").kendoMobileModalView("close");  
        };
        
        return {
            init : initial,
            show : show,
            registerValidateEmailAndGenerateOTP: registerValidateEmailAndGenerateOTP,
            callbackRegisterValidateEmailAndGenerateOTP: callbackRegisterValidateEmailAndGenerateOTP,
            closeOTPWindow: closeOTPWindow,
            cancelOTPWindow: cancelOTPWindow,
            registerValidateOTP: registerValidateOTP,
            callbackRegisterValidateOTP: callbackRegisterValidateOTP,
            requestNewOTP: requestNewOTP,
            callbackRequestNewOTP: callbackRequestNewOTP
        };
    }());
    
    return registerDeviceViewModel;
}());
