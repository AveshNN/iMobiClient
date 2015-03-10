/**
 * ClientLiason view model
 */

var app = app || {};
var displayControlEmail;

app.ClientLiason = (function () {
    'use strict'

    var displayControl;
    
    // ClientLiason view model
    var clientLiasonViewModel = (function () {
        var show = function (e) {
            document.getElementById(displayControl).innerHTML = app.User.userProfileDefaultTProfile();
            
            var trackingProfileId = app.User.userProfileDefaultTProfileId();
            getClientLiason(trackingProfileId);
        };
        
        var initial = function(x) {
            displayControl = x;
        };
        
        var getClientLiason = function(x) {
            var data = "tprofileId=" + x;  
            
            app.Service.ajaxCall("GetTrackingProfileContacts", data, "app.ClientLiason.setClientLiason", "Getting Client Liasons");
        };
        
        var setClientLiason = function(list) {
            var groupedDataLiasons = [];
            
            for (var i = 0;i < list.length;i++) {
                var contact = list[i];
                
                if (contact.Role == "Client Liaison") {
                    groupedDataLiasons.push({ Name: contact.Name, Email: contact.Email, Mobile: contact.Mobile });    
                }
            }
            
            var control = $("#grouped-listviewsLiasons");            
            app.ListControl.removeListViewWrapper(control);
        
            app.ListControl.applyDataTemplate(control, groupedDataLiasons, "#customListViewTemplateProfileLiason");
        };
        
        return {
            init : initial,
            show : show,
            getClientLiason: getClientLiason,
            setClientLiason: setClientLiason
        };
    }());
    
    return clientLiasonViewModel;
}());
