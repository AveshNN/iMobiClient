/**
 * Login view model
 */

var app = app || {};

app.Login = (function () {
    'use strict';

    var loginViewModel = (function () {
        var $password;
        
        var init = function () {
            $password = $('#password');
        };
        
        var show = function () {
            $password.val('');
        };
        
        var getYear = function () {
            var currentTime = new Date();
            return currentTime.getFullYear();
        };

        var validateUDID = function(secureUDID) {
            var data = "uuid=" + secureUDID;
            
            app.Service.ajaxCall("ValidateUUID", data, "app.Login.validateLogin", "Validating Device");
        };
        
        var ValidateSecureUUID = function(secureUDID) {
            var data = "uuid=" + secureUDID;
            
            app.Service.ajaxCall("ValidateSecureUUID", data, "app.Login.validateLogin", "Validating Device");
        };
        
        // Authenticate to use Everlive as a particular user
        var login = function () {
            var password = $password.val();
            
            var UDID = app.getDeviceSecureUDID();
            var data = "smartPhoneDeviceUUID=" + UDID + "&password=" + password;
            
            app.Service.ajaxCall("ValidateLoginJSONP", data, "app.Login.setUserData","Validating Login");
        };
        
        var setUserData = function(list) {
            if (list != null) {
                if (list.length > 0) {
                    for (var i = 0;i < list.length;i++) {
                        var userProfile = list[i];
                        if (userProfile.SmartPhoneDeviceUDID == null) {
                            closeLoginWindow();
                        }
                        else { 
                            var defaultProfile = userProfile.DefaultProfile.replace("&", " \\ ");
                            app.User.setUser(userProfile.FirstName, userProfile.LastName, defaultProfile, userProfile.Email, userProfile.DefaultProfileId, userProfile.IsMobiClientAdmin, userProfile.UserId);
                            app.mobileApp.navigate('views/home.html?firstName=' + userProfile.FirstName + '&lastName=' + userProfile.LastName + '&defaultProfile=' + defaultProfile + '&emailAddress=' + userProfile.Email + '&defaultProfileId=' + userProfile.DefaultProfileId + '&isMobiClientAdmin=' + userProfile.IsMobiClientAdmin);
                            app.AppicationMenuControl.drawerListPostLogin();
                        }
                    }
                }
                else {
                    show();
                    document.getElementById('loginStatus').innerHTML = 'Incorrect password';
                    navigator.notification.vibrate(3000);
                }
            }
        };
        
        var validateLogin = function(list) {
            
            navigator.notification.vibrate(3000);
            
            var secure = list[0];
            if (secure.IsValid == false){
                    $('#btnLogin').text('Register');
            }
            else{
                if (secure.IsApproved == false){
                        $('#btnLogin').text('Reg Pending - Reload');
                }
                else{
                    $('#btnLogin').text('Login');
                    
                    //var connectionButton = document.getElementById("btnConnections");
                    //connectionButton.style.visibility = "visible";
                    
                    app.Connections.getUserConnnections(app.getDeviceSecureUDID());
                    //app.Connections.connection();
                }
            }
        };
        
        var openLoginWindow = function() {
            var deviceStatus = $('#btnLogin').text();
            if (deviceStatus == "Login") {
                $("#modalview-login").kendoMobileModalView("open");  
                app.loadDeviceSecureUDID();
            }
            else {
                if (deviceStatus == "Register") {
                    app.mobileApp.navigate("views/registerDevice.html", "");
                }
                else {
                    if (deviceStatus == "Reg Pending - Reload") {
                        $('#btnLogin').text('Reg Pending - Reload');
                        
                        var UDID = app.getDeviceSecureUDID();
                                app.Login.ValidateSecureUUID(UDID, "DEF");
                    }
                }
            }
        };
        
        var closeLoginWindow = function() {
            var pword = document.getElementById('password');
            $("#modalview-login").kendoMobileModalView("close");
            pword.value = "";
            document.getElementById('loginStatus').innerHTML = 'Please Login';
            document.location.href = "#view-transitions";
        };

        var openConnectionWindow = function() {
            $("#modalview-Connection").kendoMobileModalView("open");  
        };
        
        var closeConnectionWindow = function() {
            $("#modalview-Connection").kendoMobileModalView("close");  
        };
       
        return {
            init: init,
            show: show,
            getYear: getYear,
            validateUDID:validateUDID,
            ValidateSecureUUID: ValidateSecureUUID,
            login: login,
            validateLogin: validateLogin,
            setUserData: setUserData,
            openLoginWindow: openLoginWindow,
            closeLoginWindow:closeLoginWindow,
            openConnectionWindow:openConnectionWindow,
            closeConnectionWindow:closeConnectionWindow
        };
    }());

    return loginViewModel;
}());
