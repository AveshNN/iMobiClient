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
    
    // Profile view model
    var profileViewModel = (function () {
        var show = function (e) {
            document.getElementById(displayControlFirstName).innerHTML = app.Home.userProfileFirstName();
            document.getElementById(displayControlLastName).innerHTML = app.Home.userProfileLastName();
            document.getElementById(displayControlDefaultProfile).innerHTML = app.Home.userProfileDefaultTProfile();
            document.getElementById(displayControlEmail).innerHTML = app.Home.userProfileEmail();
        };
        
        var initial = function(fname, lname, dprofile, email, dtprofileId) {
            displayControlFirstName = fname;
            displayControlLastName = lname;
            displayControlDefaultProfile = dprofile;
            displayControlEmail = email;
        };
        
        return {
            init : initial,
            show : show
        };
    }());
    
    return profileViewModel;
}());
