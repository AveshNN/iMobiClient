var app = (function (win) {
    'use strict';
    
    var currentDeviceSecureUDID;
    var currentOrientation;
    var applicationVersionNumber;
    var databaseVersionNumber;
    
    var onDeviceReady = function() {
        // hide the splash screen as soon as the app is ready. otherwise
        // Cordova will wait 5 very long seconds to do it for you.
        navigator.splashscreen.hide();
        
        var isSimulator = app.deviceInfo.deviceIsSimulator();
        
        databaseVersionNumber = "1.0";
        if (isSimulator === false) {
            setApplicationVersion(getApplicationVersion);
        }
        else{
            
            applicationVersionNumber = "1.0.0.0";
            document.getElementById('applicationVersion').innerHTML = "iMobi Client v" + applicationVersionNumber;
        }
        
        //Create the Database
        app.Database.openDB();
        app.Database.createTable();
        
        var db = app.Database.db();
        
        
        db.transaction(function(tx) {
            tx.executeSql("SELECT * FROM AppVersion", [], renders, app.onError);
        });
        var renders = function (tx, rs) {
            if (rs.rows.length > 0) {
                var dbVersion = rs.rows.item(0).Version;
                app.consoleLog("db v:" + dbVersion);
                if (dbVersion !== databaseVersionNumber){
                    app.consoleLog("delete");
                    app.Database.deleteTable();
                    app.consoleLog("Create");
                    app.Database.createTable();
                    app.consoleLog("add version");
                    app.Database.addVersion(databaseVersionNumber);
                   
                }
                else{
                    
                    postDeviceReady();
                }
            }
            else{
                app.Database.addVersion(databaseVersionNumber);
            }
        };
        
        //app.Database.deleteTable();
        
       app.consoleLog("ready");
        
        /*deviceSecureUDID();
        
        var connectionType = app.deviceInfo.deviceConnection();
        if (connectionType == "none") {
            //alert("No internet connection");
            app.Alert.openAlertWindow("Connection Error", "No internet connection");
            
        }
        else {
            app.Connections.setDefaultConnection("DEF");
            
        }
        
        $(window).bind('orientationchange', _orientationHandler);
        
        document.addEventListener("offline", app.deviceInfo.deviceOffline, false);
        document.addEventListener("online", app.deviceInfo.deviceOnline, false);
        document.addEventListener("resume", app.deviceInfo.deviceResume, false);*/
        
    };
    
    // Handle "deviceready" event
    document.addEventListener('deviceready', onDeviceReady, false);  

    var postDeviceReady = function(){
        app.consoleLog("i am running post");
        deviceSecureUDID();
        
        var connectionType = app.deviceInfo.deviceConnection();
        if (connectionType == "none") {
            //alert("No internet connection");
            app.Alert.openAlertWindow("Connection Error", "No internet connection");
            
        }
        else {
            app.Connections.setDefaultConnection("DEF");
            
        }
        
        $(window).bind('orientationchange', _orientationHandler);
        
        document.addEventListener("offline", app.deviceInfo.deviceOffline, false);
        document.addEventListener("online", app.deviceInfo.deviceOnline, false);
        document.addEventListener("resume", app.deviceInfo.deviceResume, false);
    };
    
    var _orientationHandler = function() {
        switch (window.orientation) {  
            case -90:
            case 90:
                currentOrientation = "LANDSCAPE";
                /*app.consoleLog("landscape");
            
                var c = document.getElementById("chartdiv");
                app.consoleLog(c);
                var a = c.getElementsByTagName('a');
                app.consoleLog(a);
                if (a.length > 0) {
                    app.consoleLog(a[0].outerHTML);
                    app.consoleLog(a[0].outerText);
                    app.consoleLog(a[0].innerText);
                    a.outerHTML = "";
                    a.outerText = "";
                    a.innerText = "";
                    
                    c.validateNow();
                }*/
                         
                break; 
            default:
                currentOrientation = "PORTRAIT"
                app.consoleLog("portrait");
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
    
    var onVersionSuccess = function(tx, r){
         postDeviceReady();
    };
    
    var getApplicationVersion = function(){
        document.getElementById('applicationVersion').innerHTML = "iMobi Client v" + applicationVersionNumber;
        return applicationVersionNumber;
    };
    
    var setApplicationVersion = function(callback_getApplicationVersion) {
        cordova.getAppVersion(function(version) {
            applicationVersionNumber = version;
            callback_getApplicationVersion();
        });
    };
    
    var consoleLog = function(message){
        var isSimulator = app.deviceInfo.deviceIsSimulator();
        if (isSimulator === true){
            console.log(message);
        }
    }
    
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
            app.consoleLog("offline:" + navigator.connection.type);
            app.Alert.openAlertWindow("Connection Error", "Internet connection lost");
        },
        
        deviceOnline : function(){
            app.consoleLog("online" + navigator.connection.type);
            app.Alert.openAlertWindow("Connection", "Internet connection established");
            app.Connections.setDefaultConnection("DEF");
        },
        
        deviceResume : function() {
            if (app.deviceInfo.deviceIsScanning() === false) {
                app.mobileApp.navigate('#view-transitions');
                app.AppicationMenuControl.drawerListPreLogin();
            
                var connectionType = app.deviceInfo.deviceConnection();
                if (connectionType == "none") {
                    //alert("No internet connection");
                    app.Alert.openAlertWindow("Connection Error", "No internet connection");
                }
                else {
                    app.Alert.openAlertWindow("Welcome Back", "Please Login");   
                
                    app.Connections.setDefaultConnection("DEF");
                }
            }
            else{
                app.ScanBarcode.setScanning(false);
            }
        },
        
        deviceIsSimulator : function() {
            
            if (window.navigator.simulator == undefined) {
                return false;
            }
            else
                return true;
        },
        
        deviceIsScanning : function() {
            return app.ScanBarcode.getScanning();
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
        app.consoleLog(e);
        e.preventDefault();
    };
    
    var onShow = function(e) {
        app.consoleLog("onShow");
    };
    
    var onInit = function(e){
        app.consoleLog("onInit");
        
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
        deviceInfo: deviceInfo,
        setApplicationVersion: setApplicationVersion,
        getApplicationVersion: getApplicationVersion,
        postDeviceReady: postDeviceReady,
        onVersionSuccess: onVersionSuccess,
        consoleLog: consoleLog
    };
}(window));
