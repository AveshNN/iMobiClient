/**
 * Login view model
 */

var app = app || {};

app.Login = (function () {
    'use strict';

    var loginViewModel = (function () {
        var $password;
        var $loginname;
        var security;
        
        var Security = function () {
            this.IsOTPValidated = false;
            this.IsApproved = false;
            this.IsValid = false;      
        };
        
        
        var init = function () {
            $password = $('#password');
            $loginname = $('#loginname');
        };
        
        var show = function () {
            $password.val('');
            $loginname.val('');
            document.location.href = "#view-transitions";
        };
        
        var getYear = function () {
            var currentTime = new Date();
            return currentTime.getFullYear();
        };

        var ValidateSecureUUID = function(secureUDID) {
            var data = "uuid=" + secureUDID;
            
            app.Service.ajaxCall("ValidateSecureUUID", data, "app.Login.validateLogin", "Validating Device");
        };
        
        // Authenticate to use Everlive as a particular user
        var login = function () {
            var password = $password.val();
            var loginname = $loginname.val();
            var UDID = app.getDeviceSecureUDID();
            var data = "smartPhoneDeviceUUID=" + UDID + "&userName=" + loginname + "&password=" + password;
            
            app.Service.ajaxCall("ValidateLoginJSONP", data, "app.Login.setUserData","Validating Login");
        };
        
        var setUserData = function(list) {
            window.mySwipe.stop();
            if (list != null) {
                if (list.length > 0) {
                    for (var i = 0;i < list.length;i++) {
                        var userProfile = list[i];
                        console.log(userProfile);
                        if (userProfile.SmartPhoneDeviceUDID == null) {
                            closeLoginWindow();
                        }
                        else { 
                            var defaultProfile = userProfile.DefaultProfile.replace("&", " \\ ");
                            app.User.setUser(userProfile.LoginName, userProfile.FirstName, userProfile.LastName, defaultProfile, userProfile.Email, userProfile.DefaultProfileId, userProfile.IsMobiClientAdmin, userProfile.UserId);
                            app.mobileApp.navigate('views/home.html?firstName=' + userProfile.FirstName + '&lastName=' + userProfile.LastName + '&defaultProfile=' + defaultProfile + '&emailAddress=' + userProfile.Email + '&defaultProfileId=' + userProfile.DefaultProfileId + '&isMobiClientAdmin=' + userProfile.IsMobiClientAdmin);
                            app.AppicationMenuControl.drawerListPostLogin();
                        }
                    }
                }
                else {
                    show();
                    document.getElementById('loginStatus').innerHTML = 'Incorrect Username or password';
                    navigator.notification.vibrate(3000);
                }
            }
        };
        
        var validateLogin = function(list) {
            //navigator.notification.vibrate(3000);
            
            var secure = list[0];
            security = new app.Login.Security();
            security.IsValid = secure.IsValid;
            security.IsOTPValidated = secure.IsOTPValidated;
            security.IsApproved = secure.IsApproved;
            
            if (security.IsValid == false) {
                $('#btnLogin').text('Register');
            }
            else {
                if (security.IsOTPValidated === false) {
                    $('#btnLogin').text('Enter OTP');
                }
                else {
                    if (security.IsApproved == false) {
                        $('#btnLogin').text('Not Approved - Reload');
                        document.getElementById('statusHome').innerHTML = "Account awaiting approval";
                        var el = document.getElementById('statusHome');
                        var effect = kendo.fx(el).fadeOut().duration(3000);
                        effect.play();
                    }
                    else {
                        $('#btnLogin').text('Login');
                    
                        //var connectionButton = document.getElementById("btnConnections");
                        //connectionButton.style.visibility = "visible";
                    
                        app.Connections.getUserConnnections(app.getDeviceSecureUDID());
                        //app.Connections.connection();
                    }
                }
            }
        };
        
        var openLoginWindow = function() {
            //var deviceStatus = $('#btnLogin').text();
            //if (deviceStatus == "Login") {
            if (security.IsValid === false) {
                app.mobileApp.navigate("views/registerDevice.html", "");    
            }
            else {
                if (security.IsOTPValidated === false) {
                    $("#modalview-OTP").kendoMobileModalView("open");  
                }
                else {
                    //if (deviceStatus == "Not Approved - Reload") {
                    if (security.IsApproved === false) {
                        $('#btnLogin').text('Not Approved - Reload');
                        
                        var UDID = app.getDeviceSecureUDID();
                        app.Login.ValidateSecureUUID(UDID, "DEF");
                    }
                    else {
                        $("#modalview-login").kendoMobileModalView("open");  
                        document.getElementById('loginStatus').innerHTML = 'Please Login';
                        app.loadDeviceSecureUDID();
                    }
                }
            }
            
            /*if (security.IsValid === true) {
                $("#modalview-login").kendoMobileModalView("open");  
                app.loadDeviceSecureUDID();
            }
            else {
                //if (deviceStatus == "Register") {
                if (security.IsValid === false) {
                    app.mobileApp.navigate("views/registerDevice.html", "");
                }
                else {
                    //if (deviceStatus == "Register") {
                    if (security.IsOTPValidated === false) {
                        app.mobileApp.navigate("views/registerDevice.html", "");
                    }
                    else {
                        //if (deviceStatus == "Not Approved - Reload") {
                        if (security.IsApproved === false) {
                            $('#btnLogin').text('Not Approved - Reload');
                        
                            var UDID = app.getDeviceSecureUDID();
                            app.Login.ValidateSecureUUID(UDID, "DEF");
                        }
                    }
                }
            }*/
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
            ValidateSecureUUID: ValidateSecureUUID,
            login: login,
            validateLogin: validateLogin,
            setUserData: setUserData,
            openLoginWindow: openLoginWindow,
            closeLoginWindow:closeLoginWindow,
            openConnectionWindow:openConnectionWindow,
            closeConnectionWindow:closeConnectionWindow,
            Security: Security
        };
    }());

    return loginViewModel;
}());
