/**
 * AppicationMenuControl view model
 */

var app = app || {};

app.AppicationMenuControl = (function () {
    'use strict'

    // AppicationMenuControl view model
    var appicationMenuControl = (function () {
        
        var drawerListPreLogin = function() {
            
            var isSimulator = app.deviceInfo.deviceIsSimulator();
            
            var groupedData = [];
   
            groupedData.push({ Description: "Login", icon:"play", Id: "#view-transitions", Code:"LOGIN"});
    
            var control = $("#listviewsMenu");            
            app.ListControl.removeListViewWrapper(control);
        
            app.ListControl.applyDataTemplate(control, groupedData, "#templatelistviewsMenu");
            
            app.Login.show();
        };
        
        var drawerListPostLogin = function() {
            var groupedData = [];
   
            groupedData.push({ Description: "Home", icon:"home", Id: "views/home.html", Code:"HOME"});
            groupedData.push({ Description: "Beacons", icon:"icon-target", Id: "views/beacons.html", Code:"BEAC"});
            groupedData.push({ Description: "Devices", icon:"toprated", Id: "views/devices.html", Code:"DEV"});
            groupedData.push({ Description: "Inventory", icon:"globe", Id: "views/inventory.html", Code:"INV"});
            groupedData.push({ Description: "My Client Liason",icon:"contacts",  Id: "views/clientLiason.html", Code:"CLO"});
            groupedData.push({ Description: "My Profile", icon:"settings", Id: "views/profile.html", Code:"PRO"});
            groupedData.push({ Description: "Scan Barcode", icon:"camera", Id: "views/scan.html", Code:"SCAN"});
            groupedData.push({ Description: "Transactions", icon:"transaction-e", Id: "views/transactions.html", Code:"TRAN"});
            groupedData.push({ Description: "Request Report", icon:"bookmarks", Id: "views/reports.html", Code:"REP"});
            groupedData.push({ Description: "Logout", icon:"stop", Id: "index.html", Code:"LOGOUT"});
    
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

