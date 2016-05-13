/**
 * ForgotPassword view model
 */

var app = app || {};

app.ForgotPassword = (function () {
    'use strict';

    var forgotPasswordViewModel = (function () {
        var $emailaddress;
        var $loginname;
        
        var init = function () {
            $emailaddress = $('#emailaddress');
            $loginname = $('#loginnameForgotPassword');
        };
        
        var show = function () {
            $emailaddress.val('');
            $loginname.val('');
        };
               
        // Authenticate to use Everlive as a particular user
        var requestPassword = function () {
            var emailAddress = document.getElementById('emailaddress').value;
            var loginname =  document.getElementById('loginnameForgotPassword').value;
            
            var status = document.getElementById('statusForgotPassword');
            var effect = kendo.fx(status).fadeOut().duration(3000);
            if (loginname === "" || loginname === undefined) {
                status.innerHTML = "Username Required";
                effect.play();
                return;
            }
            
            if (emailAddress === "" || emailAddress === undefined) {
                status.innerHTML = "Email Required";
                effect.play();
                return;
            }
                
            var data = "email=" + emailAddress + "&username=" + loginname;
            
            app.Service.ajaxCall("ForgotPassword", data, "app.ForgotPassword.callbackRequestPassword", "Requesting Password");
        };
        
        var callbackRequestPassword = function(result) {
            var status = document.getElementById('statusForgotPassword');
            if (result === false) {
                status.innerHTML = "Invalid username or email address";
                var effect = kendo.fx(status).fadeOut().duration(4000);
                effect.play();
            }
            else {
                status.innerHTML = "Password sent to email";
                var effect = kendo.fx(status).fadeOut().duration(4000);
                effect.play();
                closeForgotPassword();
            }
        };

        var openForgotPassword = function() {
            document.getElementById('loginnameForgotPassword').value = "";
            document.getElementById('emailaddress').value = "";
            $("#modalview-ForgotPassword").kendoMobileModalView("open");  
        };
        
        var closeForgotPassword = function() {
             $emailaddress.val('');
            $loginname.val('');
            $("#modalview-ForgotPassword").kendoMobileModalView("close");  
        };
       
        return {
            init: init,
            show: show,
            requestPassword: requestPassword,
            callbackRequestPassword: callbackRequestPassword,
            openForgotPassword: openForgotPassword,
            closeForgotPassword: closeForgotPassword
        };
    }());

    return forgotPasswordViewModel;
}());
