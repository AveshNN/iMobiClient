/**
 * Profile view model
 */

var app = app || {};

app.Profile = (function () {
    'use strict'

    var displayControlFirstName;
    var displayControlLastName;
    var displayControlDefaultProfile;
    var displayControlEmail;
    var groupedData = [];
    var service;
    
    // Profile view model
    var profileViewModel = (function () {
        var show = function (e) {
            document.getElementById(displayControlFirstName).innerHTML = app.User.userProfileFirstName();
            document.getElementById(displayControlLastName).innerHTML = app.User.userProfileLastName();
            document.getElementById(displayControlDefaultProfile).innerHTML = app.User.userProfileDefaultTProfile();
            document.getElementById(displayControlEmail).innerHTML = app.User.userProfileEmail();
            
            if (app.User.userProfileIsMobiClientAdmin() === false) {
                
                //disableSwitchProfile(false);
                $("#switchProfile").data("kendoMobileButton").enable(false);
            }
            else {
                //disableSwitchProfile(true);
                $("#switchProfile").data("kendoMobileButton").enable(true);
            }
            
           service = app.Service.getService() + "GetUserTrackingProfilesByUserId";
          
        };
        
        var initial = function(fname, lname, dprofile, email, dtprofileId) {
            displayControlFirstName = fname;
            displayControlLastName = lname;
            displayControlDefaultProfile = dprofile;
            displayControlEmail = email;
            
            /*$("#switch").kendoMobileSwitch({
                                               checked: false,
                                               onLabel: "YES",
                                               offLabel: "NO"
                                           });*/
        };
                
       
        
        var scrollToTopProfile = function() {
            $(".km-scroll-container").css("-webkit-transform", "");
        }
        
        var switchChange = function(e) {
            var check = e.checked;
            console.log(check);
            if (check === true) {
                $("#modalview-Profiles").kendoMobileModalView("open");  
                document.getElementById("search").style.display = "none";
                document.getElementById("txtSearch").value = "";
                
                
                app.Profile.scrollToTopProfile();
                
                groupedData = [];
                app.Profile.getProfiles();
            }
        };
        
        var switchProfile = function(){
             $("#modalview-Profiles").kendoMobileModalView("open");  
                document.getElementById("search").style.display = "none";
                document.getElementById("txtSearch").value = "";
                
                
                app.Profile.scrollToTopProfile();
                
                groupedData = [];
                app.Profile.getProfiles();
        };
        
        var closeProfilesWindow = function(TProfileId, TProfile) {
            $("#modalview-Profiles").kendoMobileModalView("close");  
            
           /* var switchInstance = $("#switch").data("kendoMobileSwitch");

            // get the checked state of the switch.
            // set the checked state of the switch.
            switchInstance.check(false);*/
            
            app.Profile.scrollToTopProfile();
            
            app.User.setUserProfile(TProfile, TProfileId);
            
            document.getElementById(displayControlDefaultProfile).innerHTML = app.User.userProfileDefaultTProfile();
        };
        
         var cancelProfilesWindow = function() {
            $("#modalview-Profiles").kendoMobileModalView("close");  
            
           /* var switchInstance = $("#switch").data("kendoMobileSwitch");

            // get the checked state of the switch.
            // set the checked state of the switch.
            switchInstance.check(false);*/
            app.Profile.scrollToTopProfile();
        };
        
        var disableSwitchProfile = function(enable) {
            var switchInstance = $("#switch").data("kendoMobileSwitch");
            app.consoleLog("disableSwitchProfile: " + enable);
            switchInstance.enable(enable);
        };
        
        var searchProfileClick = function(){
            document.getElementById("search").style.display = "block";
            $('#txtSearch').focus();
            
            $("#txtSearch").on('change keyup paste', function () {
                groupedData = [];
                app.Profile.scrollToTopProfile();
                searchProfile();
            });
            
        };
        
        var searchProfile = function() {
            var searchString = $("#txtSearch").val();
            if (searchString === "") {
                groupedData = [];
                
                getProfiles();
                
                app.Profile.scrollToTopProfile();
                return;
            }
            else {
                
                app.consoleLog(searchString);    
                var skip = 0;
                var userId = app.User.userProfileUserId();
                var data = "userId=" + userId + "&skip=" + skip + "&text=" + searchString;
            
                app.Service.ajaxCall("GetUserTrackingProfilesByUserId", data, "app.Profile.setProfiles", "Loading Profiles");
            }
        };
        
        var getProfiles = function() {           
            var skip = groupedData.length;
            var userId = app.User.userProfileUserId();
            var data = "userId=" + userId + "&skip=" + skip;
            var searchString = $("#txtSearch").val();
            if (searchString !== "") {
                data = data + "&text=" + searchString;
            }
            
            app.Service.ajaxCall("GetUserTrackingProfilesByUserId", data, "app.Profile.setProfiles", "Loading Profiles");
        };
        
        var setProfiles = function(list) {
            if (list != null) {	
                for (var i = 0;i < list.length;i++) {
                    var inv = list[i];
                    groupedData.push({ TProfileId: inv.TProfileId, TProfile: inv.TProfile});
                }
                            
                var retProfiles = $("#grouped-listviewsProfiles");            
                app.ListControl.removeListViewWrapper(retProfiles);
                app.ListControl.applyDataTemplate(retProfiles, groupedData, "#customListViewProfiles");
            }
        };
                
        return {
            init : initial,
            show : show,
            switchChange : switchChange,
            closeProfilesWindow : closeProfilesWindow,
            disableSwitchProfile : disableSwitchProfile,
            getProfiles : getProfiles,
            setProfiles : setProfiles,
            scrollToTopProfile : scrollToTopProfile,
            cancelProfilesWindow : cancelProfilesWindow,
            searchProfile : searchProfile,
            searchProfileClick : searchProfileClick,
            switchProfile: switchProfile
        };
    }());
    
    return profileViewModel;
}());
