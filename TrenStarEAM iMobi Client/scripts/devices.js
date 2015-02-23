/**
 * Devices view model
 */

var app = app || {};

app.Devices = (function () {
    'use strict'

    var displayControl;
    
    // Devices view model
    var devicesViewModel = (function () {
        var show = function (e) {
            document.getElementById(displayControl).innerHTML = app.Home.userProfileDefaultTProfile();
            
            var trackingProfileId = app.Home.userProfileDefaultTProfileId();
            getProfileDevices(trackingProfileId);
        };
        
        var initial = function(x) {
            displayControl = x;
        };
        
        var getProfileDevices = function(x) {
            var data = "tprofileId=" + x;  
            
            app.Service.ajaxCall("GetProfileDevices", data, "app.Devices.setProfileDevices", "Getting Devices");
        };
        
        var setProfileDevices = function(list) {
            var groupedDataDevices = [];
            
            if (list != null) {
                for (var i = 0;i < list.length;i++) {
                    var device = list[i];
                
                    groupedDataDevices.push({ Scanner: device.Scanner, DeviceId: device.DeviceId });    
                }
            }
            document.getElementById("numberOfDevices").value = groupedDataDevices.length;
            if (groupedDataDevices.length == 0) {
                groupedDataDevices.push({ Scanner: "No Devices Available", DeviceId: -1 });       
            }
            
            var control = $("#grouped-listviewsDevices");            
            app.ListControl.removeListViewWrapper(control);
        
            app.ListControl.applyDataTemplate(control, groupedDataDevices, "#customListViewTemplateProfileDevices");
        };
        
        return {
            init : initial,
            show : show,
            getProfileDevices: getProfileDevices,
            setProfileDevices: setProfileDevices
        };
    }());
    
    return devicesViewModel;
}());
