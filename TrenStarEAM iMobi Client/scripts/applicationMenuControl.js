/**
 * AppicationMenuControl view model
 */

var app = app || {};

app.AppicationMenuControl = (function () {
    'use strict'

    // AppicationMenuControl view model
    var appicationMenuControl = (function () {
        var drawerListPreLogin = function() {
            var groupedData = [];
   
            groupedData.push({ Description: "Login", Id: "#view-transitions", Code:"LOGIN"});
    
            var control = $("#listviewsMenu");            
            app.ListControl.removeListViewWrapper(control);
        
            app.ListControl.applyDataTemplate(control, groupedData, "#templatelistviewsMenu");
            
            app.Login.show();
        };
        
        var drawerListPostLogin = function() {
            var groupedData = [];
   
            groupedData.push({ Description: "Home", Id: "views/home.html", Code:"HOME"});
            groupedData.push({ Description: "Devices", Id: "views/devices.html", Code:"DEV"});
            groupedData.push({ Description: "Inventory", Id: "views/inventory.html", Code:"INV"});
            groupedData.push({ Description: "My Client Liason", Id: "views/clientLiason.html", Code:"CLO"});
            groupedData.push({ Description: "My Profile", Id: "views/profile.html", Code:"PRO"});
            groupedData.push({ Description: "Scan Barcode", Id: "views/scan.html", Code:"SCAN"});
            groupedData.push({ Description: "Request Report", Id: "views/reports.html", Code:"REP"});
            groupedData.push({ Description: "Logout", Id: "index.html", Code:"LOGOUT"});
    
            var control = $("#listviewsMenu");            
            app.ListControl.removeListViewWrapper(control);
        
            app.ListControl.applyDataTemplate(control, groupedData, "#templatelistviewsMenu");
        };
       
        
        return {
            drawerListPostLogin : drawerListPostLogin,
            drawerListPreLogin : drawerListPreLogin
            
        };
    }());
    
    return appicationMenuControl;
}());
