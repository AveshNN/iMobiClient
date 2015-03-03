/**
 * Database view model
 */

var app = app || {};

app.Database = (function () {
    'use strict'
    app.db = null;
    
    // Database view model
    var databaseViewModel = (function () {
        
        var db = function(){
            return app.db;
        }
        
        //DATABASE CONFIG
        var openDb = function() {
            var isSimulator = app.deviceInfo.deviceIsSimulator();
            console.log("isSimulator:" + isSimulator);
             
            if (isSimulator === false) {
                app.db = window.sqlitePlugin.openDatabase("TrenStarEAMClient");
            }
            else {
                console.log("Is Simu:" + "YES");
                // For debugin in simulator fallback to native SQL Lite
                console.log("Use built in SQL Lite");
                app.db = window.openDatabase("TrenStarEAMClient", "1.0", "EAM iMobi", 200000);
            }
        };
            
        var deleteTable = function() {
            db().transaction(function(tx) {
                tx.executeSql("DROP TABLE IF EXISTS UserProfileInfo");
            });
            db().transaction(function(tx) {
                tx.executeSql("DROP TABLE IF EXISTS Connection");
            });
        };
            
        var createTable = function() {
            
            db().transaction(function(tx) {
                tx.executeSql("CREATE TABLE IF NOT EXISTS UserProfileInfo(ID INTEGER PRIMARY KEY ASC, Polling INTEGER, Subscriptions INTEGER, CreateDate DATETIME, ModifiedDate DATETIME)", []);
            });
                
            db().transaction(function(tx) {
                tx.executeSql("CREATE TABLE IF NOT EXISTS Connection(ID INTEGER PRIMARY KEY ASC, ConnectionName varchar(10), ConnectionCode varchar(10), WCFConnection varchar(150), IsSet BOOLEAM)", []);
            });
            
        };
            
        var updateUserProfile = function(Polling) {
            db.transaction(function(tx) {
                var createDate = new Date();
                tx.executeSql("INSERT INTO UserProfileInfo(Polling, CreateDate) VALUES (?,?)",
                              [Polling, createDate],
                              app.onSuccess,
                              app.onError);
            });
        };
            
        var updateRecord = function(id, t) {
            db().transaction(function(tx) {
                var mDate = new Date();
                tx.executeSql("UPDATE UserProfileInfo SET text_sample = ?, date_sample = ? WHERE id = ?",
                              [t, mDate, id],
                              app.onSuccess,
                              app.onError);
            });
        };
        
        return{
            openDB:openDb,
            deleteTable: deleteTable,
            createTable:createTable,
            updateUserProfile:updateUserProfile,
            updateRecord:updateRecord,
            db:db
        }
    }());
    
    return databaseViewModel;
}());