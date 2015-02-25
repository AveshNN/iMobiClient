var app = (function (win) {
    'use strict';
    var currentDeviceSecureUDID;
    var currentOrientation;
    var onDeviceReady = function() {
        // hide the splash screen as soon as the app is ready. otherwise
        // Cordova will wait 5 very long seconds to do it for you.
        navigator.splashscreen.hide();
        
        
        //Create the Database
        
        app.Database.openDB();
        //app.Database.deleteTable();
        app.Database.createTable();
        
        console.log("ready");
        
        deviceSecureUDID();
        
        var connectionType = app.deviceInfo.deviceConnection();
        if (connectionType == "none") {
            alert("No internet connection");
        }
        else {
            app.Connections.setDefaultConnection("DEF");
            
        }
        
        
        $(window).bind('orientationchange', _orientationHandler);
        
        document.addEventListener("offline", app.deviceInfo.deviceOffline, false);
        document.addEventListener("online", app.deviceInfo.deviceOnline, false);
        
    };

    // Handle "deviceready" event
    document.addEventListener('deviceready', onDeviceReady, false);  

    var _orientationHandler = function() {
        switch (window.orientation) {  
            case -90:
            case 90:
                currentOrientation = "LANDSCAPE";
                /*console.log("landscape");
            
                var c = document.getElementById("chartdiv");
                console.log(c);
                var a = c.getElementsByTagName('a');
                console.log(a);
                if (a.length > 0) {
                    console.log(a[0].outerHTML);
                    console.log(a[0].outerText);
                    console.log(a[0].innerText);
                    a.outerHTML = "";
                    a.outerText = "";
                    a.innerText = "";
                    
                    c.validateNow();
                }*/
                         
                break; 
            default:
                currentOrientation = "PORTRAIT"
                console.log("portrait");
                break; 
        }
    };
    
    var os = kendo.support.mobileOS, 
        statusBarStyle = os.ios && os.flatVersion >= 900 ? 'black-translucent' : 'black';

    // Initialize KendoUI mobile application
    var mobileApp = new kendo.mobile.Application(document.body, {
                                                     statusBarStyle: statusBarStyle,
                                                     skin: 'flat'
                                                     // the application needs to know which view to load first
                                                     //initial: 'views/landingPage.html'
                                                     //initial: 'index.html'
                                                 });
    
    // Global error handling
    var showAlert = function(message, title, callback) {
        navigator.notification.alert(message, callback || function () {
        }, title, 'OK');
    };

    var showError = function(message) {
        showAlert(message, 'Error occured');
    };
    
    var getYear = (function () {
        var currentTime = new Date();
        return currentTime.getFullYear();
    });
    
    var onError = function(tx, e) {
        showError("Error: " + e.message);
    }; 
            
    var onSuccess = function(tx, r) {
        //app.refresh();
    };
    
    var deviceInfo = {
        deviceOsVersion : function() {
            return device.version;   
        },
            
        deviceModel : function() {
            return device.model;  
        },
            
        deviceplatform : function() {
            return device.platform
        },
        
        deviceOrientation : function(){
            return currentOrientation;
        },
        
        deviceConnection : function(){
            return navigator.connection.type;
        },
        
        deviceOffline : function(){
            console.log("offline:" + navigator.connection.type);
        },
        
        deviceOnline : function(){
            console.log("online" + navigator.connection.type);
        },
        
        deviceIsSimulator : function() {
            if (window.navigator.simulator == undefined) {
                return false;
            }
            else
                return true;
        }
    };
    
    //UDID is deprecated in IOS. We know create our own
    var deviceSecureUDID = (function () {
        var isSimulator = app.deviceInfo.deviceIsSimulator();
        if (isSimulator === false) {
        //if (window.navigator.simulator === false) {
            if (device.platform.toUpperCase() == "IOS") {
                var secureDeviceIdentifier = window.plugins.secureDeviceIdentifier;
                
                if (secureDeviceIdentifier !==undefined) {
                    secureDeviceIdentifier.get({
                                                   domain: 'za.co.trenstar.iMobi.TrenStarEAMiMobi',
                                                   key: 'tr3nst@r'
                                               }, function(udid) {
                                                   currentDeviceSecureUDID = udid;
                                               });  
                }
                else {
                    currentDeviceSecureUDID = device.uuid;
                }
            }
            else{
                currentDeviceSecureUDID = device.uuid;
            }
        }
        else {
            currentDeviceSecureUDID = device.uuid;  
        }
        
    });
    
    var loadDeviceSecureUDID = function() {
        document.getElementById('deviceUUID').innerHTML = getDeviceSecureUDID();
    }
    
    var getDeviceSecureUDID = function() {
        if (currentDeviceSecureUDID === undefined) {
            currentDeviceSecureUDID = deviceSecureUDID();
        }
        return currentDeviceSecureUDID;
    };
    
    var navigate = function(e, code){
        if (code == "LOGOUT"){
            logout();
        }
        app.mobileApp.navigate(e);
    };
    
    // Navigate to app home
    var navigateHome = function () {
        app.mobileApp.navigate('#home');
    };
    
    // Navigate to app home
    var navigateOut = function () {
        app.AppicationMenuControl.drawerListPreLogin();
    };
    
    // Logout user
    var logout = function () {
        
        navigateOut();
    };
    
    var prevent = function(e) {
        console.log(e);
        e.preventDefault();
    };
    
    var onShow = function(e) {
        console.log("onShow");
    };
    
    var onInit = function(e){
        console.log("onInit");
        
    };
    
    var showSpinner = function(message){
        
    };
    
    return {
        prevent:prevent,
        onShow:onShow,
        onInit:onInit,
        navigate:navigate,
        showAlert: showAlert,
        showError: showError,
        mobileApp: mobileApp,
        getYear: getYear,
        deviceSecureUDID:deviceSecureUDID,
        getDeviceSecureUDID:getDeviceSecureUDID,
        loadDeviceSecureUDID:loadDeviceSecureUDID,
        logout: logout,
        onError:onError,
        onSuccess:onSuccess,
        deviceInfo: deviceInfo
    };
}(window));
