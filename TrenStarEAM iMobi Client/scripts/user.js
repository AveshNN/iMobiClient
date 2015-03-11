/**
 * User view model
 */

var app = app || {};

app.User = (function () {
    'use strict'

    var userFirstName;
    var userLastName;
    var userDefaultProfile;
    var userEmail;
    var userDefaultTProfileId;
    var userIsMobiClientAdmin;
    var userUserId;
    
    // User view model
    var userViewModel = (function () {
        var setUser = function(fname, lname, dprofile, email, dtprofileId, isClientAdmin, userId) {
            userFirstName = fname;
            userLastName = lname;
            userDefaultProfile = dprofile;
            userEmail = email;
            userDefaultTProfileId = dtprofileId;
            userIsMobiClientAdmin = isClientAdmin;
            userUserId = userId;
            
            app.consoleLog("set User");
        };
        
        var setUserProfile = function(dprofile, dtprofileId) {
            userDefaultProfile = dprofile;
            userDefaultTProfileId = dtprofileId;
            app.consoleLog("setUserProfile");
        };
        
        var userProfileFirstName = function() {
            return userFirstName;
        };
        
        var userProfileLastName = function() {
            return userLastName;
        };
        
        var userProfileEmail = function() {
            return userEmail;
        };
        
        var userProfileDefaultTProfileId = function() {
            return userDefaultTProfileId;
        };
        
        var userProfileDefaultTProfile = function() {
            return userDefaultProfile;
        };
        
        var userProfileIsMobiClientAdmin = function() {
            return userIsMobiClientAdmin;
        };
        
        var userProfileUserId = function() {
            return userUserId;
        };
        
        var userIsMobiClientAdmin = function() {
            return userIsMobiClientAdmin;
        };
        
        return {
            setUser : setUser,
            setUserProfile : setUserProfile,
            userProfileEmail: userProfileEmail,
            userProfileDefaultTProfileId: userProfileDefaultTProfileId,
            userProfileDefaultTProfile: userProfileDefaultTProfile,
            userProfileFirstName: userProfileFirstName,
            userProfileLastName: userProfileLastName,
            userProfileIsMobiClientAdmin: userProfileIsMobiClientAdmin,
            userProfileUserId: userProfileUserId
        };
    }());
    
    return userViewModel;
}());
