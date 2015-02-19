/**
 * Connections view model
 */

var app = app || {};

app.Connections = (function () {
    'use strict'

    // Connections view model
    var connectionsViewModel = (function () {
        var connection = function() {
            var db = app.Database.db();
       
            db.transaction(function(tx) {
                tx.executeSql("SELECT * FROM Connection", [], render, app.onError);
            });
            
            var render = function (tx, rs) {
                var connectionSet = false;
                
                if (rs.rows.length > 0) {
                    for (var i = 0; i < rs.rows.length; i++) {
                        var connectionName = rs.rows.item(i).ConnectionName;
                        connectionSet = rs.rows.item(i).IsSet;
                        console.log(connectionName + ":" + connectionSet);
                        if (connectionSet == "true") {
                            app.Service.setServiceCode(rs.rows.item(i).ConnectionCode); 
                            //app.Service.setService(rs.rows.item(i).WCFConnection); 
                            //wcfServiceUrl = rs.rows.item(i).WCFConnection;
                            var UDID = app.getDeviceSecureUDID();
                            app.Login.ValidateSecureUUID(UDID);
                            break;
                        }
                    }
                }
                else {
                    defaultConnection(db);
                    setNewConnection("EAM SA", "EAMSA");
                }
            }
        };
        
        var setDefaultConnection = function(connectionCode) {
            var db = app.Database.db();
       
            db.transaction(function(tx) {
                tx.executeSql("SELECT * FROM Connection", [], render, app.onError);
            });
            
            var render = function (tx, rs) {
                if (rs.rows.length > 0) {
                    
                    for (var i = 0; i < rs.rows.length; i++) {
                        
                        
                        if (rs.rows.item(i).ConnectionCode == connectionCode) {
                            
                            app.Service.setService(rs.rows.item(i).WCFConnection); 
                            console.log(app.Service.getService());
                            
                            var UDID = app.getDeviceSecureUDID();
                            app.Login.ValidateSecureUUID(UDID);
                        }
                    }
                }
                else {
                    defaultConnection(db);
                    setDefaultConnection(connectionCode);
                }
            }
        };
        
        var defaultConnection = function(db) {
            
            db.transaction(function(tx) {
                tx.executeSql("INSERT INTO Connection(ConnectionName, ConnectionCode, WCFConnection, IsSet) VALUES (?,?,?,?)",
                              ["DEFAULT", "DEF", "http://trenstareamtest.trenstar.co.za/TrenstarEAM.iMobile.Service.Client/Service1.svc/", true],
                              app.onSuccess,
                              app.onError);
                /* tx.executeSql("INSERT INTO Connection(ConnectionName, ConnectionCode, WCFConnection, IsSet) VALUES (?,?,?)",
                ["EAM SA", "EAMSA", "http://trenstaream.trenstar.co.za/TrenstarEAM.iMobile.Service/Service1.svc/", false],
                app.onSuccess,
                app.onError);
                tx.executeSql("INSERT INTO Connection(ConnectionName, ConnectionCode, WCFConnection, IsSet) VALUES (?,?,?)",
                ["EAMSAQA", "http://trenstareamtest.trenstar.co.za/TrenstarEAM.iMobile.Service/Service1.svc/", false],
                app.onSuccess,
                app.onError);
                tx.executeSql("INSERT INTO Connection(ConnectionName, ConnectionCode, WCFConnection, IsSet) VALUES (?,?,?)",
                ["EAMEU", "http://eameu.trenstar.co.za/TrenstarEAM.iMobile.Service/Service1.svc/", false],
                app.onSuccess,
                app.onError);
                tx.executeSql("INSERT INTO Connection(ConnectionName, ConnectionCode, WCFConnection, IsSet) VALUES (?,?,?)",
                ["EAMEUQA", "http://europeqa.trenstar.co.za/TrenstarEAM.iMobile.Service/Service1.svc/", false],
                app.onSuccess,
                app.onError);*/
            });
        };
        
        var setNewConnection = function(connectionName, connectionCode) {
            $('#btnLogin').text('Login');
            var db = app.Database.db();
    
            db.transaction(function(tx) {
                tx.executeSql("SELECT * FROM Connection", [], render, app.onError);
            });
            
            if (connectionCode != null) {
                console.log("setNewConnection= " + connectionCode);
                var render = function (tx, rs) {
                    console.log("(rs.rows.length=" + rs.rows.length);
                    if (rs.rows.length > 0) {
                        for (var i = 0; i < rs.rows.length; i++) {
                            if (rs.rows.item(i).ConnectionCode == connectionCode) {
                                $('#' + connectionCode).removeClass('connectionSelect');    
                                $('#' + connectionCode).addClass('connectionSelected');
                            }
                            else {
                                $('#' + rs.rows.item(i).ConnectionCode).removeClass('connectionSelected');    
                                $('#' + rs.rows.item(i).ConnectionCode).addClass('connectionSelect');
                            }
                        }
                    
                        db.transaction(function(tx) {
                            tx.executeSql("UPDATE Connection SET IsSet = ? WHERE ConnectionName <> ?",
                                          [false, connectionName],
                                          app.onSuccess,
                                          onConnectionError);
                
                            tx.executeSql("UPDATE Connection SET IsSet = ? WHERE ConnectionName = ?",
                                          [true, connectionName],
                                          onConnectionSuccess,
                                          onConnectionError);
                        });
                    }
                    else {
                        defaultConnection(db);            
                    }
                }
            }
        };
        
        var getUserConnnections = function(secureUDID) {
            var data = "uuid=" + secureUDID; 
            
            app.Service.ajaxCall("GetUserConnections", data, "app.Connections.setUserConnections");
        };
    
        var setUserConnections = function(list) {
            var availableConnections = [];
            
            var db = app.Database.db();
            var found = false;
            
            db.transaction(function(tx) {
                tx.executeSql("SELECT * FROM Connection", [], render, app.onError);
            });
    
            var render = function (tx, rs) {
                if (rs.rows.length > 0) {
                    var connectionSet = false;
                    for (var i = 0;i < list.length;i++) {
                        availableConnections.push({ConnectionName:list[i].Connection, ConnectionCode:list[i].ConnectionCode});
                            
                        for (var j = 0; j < rs.rows.length; j++) {
                            if (rs.rows.item(j).ConnectionCode == list[i].ConnectionCode) {
                                found = true;
                                console.log("Found: " + list[i].ConnectionCode);
                                
                                break;
                            }
                        }
                        if (found == false) {
                            app.Connections.insertConnection(list[i].Connection, list[i].ConnectionCode);
                            if (connectionSet == false) {
                                console.log("set" + list[i].Connection);
                                app.Connections.setNewConnection(list[i].Connection, list[i].ConnectionCode);
                                connectionSet = true;
                            }
                        }
                    }
                    
                    var listviewAvailableConnections = $("#grouped-listviewsAvailableConnections");
                    app.ListControl.removeListViewWrapper(listviewAvailableConnections);

                    app.ListControl.applyDataTemplate(listviewAvailableConnections, availableConnections, "#customListViewConnections");
                }
                
                if (list.length == 0) {
                    app.Connections.deleteConnections(db);   
                    app.Connections.defaultConnection(db);
                    
                    $('#loginStatusConnection').text("Sorry, No Access to EAM");
                }
                else {
                    db.transaction(function(txn) {
                        txn.executeSql("SELECT * FROM Connection", [], renderUpdate, app.onError);
                    });
    
                    var renderUpdate = function (txn, rss) {
                        if (rss.rows.length > 0) {
                            for (var i = 0; i < rss.rows.length; i++) {
                                if (rss.rows.item(i).IsSet == "true") {
                                    console.log("Current set:" +rss.rows.item(i).ConnectionCode);
                                    $('#' + rss.rows.item(i).ConnectionCode).removeClass('connectionSelect');    
                                    $('#' + rss.rows.item(i).ConnectionCode).addClass('connectionSelected');
                                
                                    $('#loginStatusConnection').text(rss.rows.item(i).ConnectionName);
                                    app.Service.setServiceCode(rs.rows.item(i).ConnectionCode); 
                                }
                            }
                        }
                    }
                }
            };
        };
        
        var insertConnection = function(connectionName, connectionCode) {
            console.log("insertConnection:" + connectionName);
            var db = app.Database.db();
            db.transaction(function(tx) {
                tx.executeSql("INSERT INTO Connection(ConnectionName, ConnectionCode, WCFConnection, IsSet) VALUES (?,?,?,?);" ,
                              [connectionName, connectionCode, "", false],
                              app.onSuccess,
                              app.onError);
            });
        };
        
         var deleteConnections = function(db) {
            db.transaction(function(ctx) {
                ctx.executeSql('DELETE FROM Connection', [], app.onSuccess, app.onError); 
            });
        }
        
        var onConnectionSuccess = function(tx, r) {
            connection(); 
        };
        
        var onConnectionError = function(tx, e) {
            app.onError(tx, e);
        };
        
        var connectionClick = function(e) {
            alert(e);
        };
        
        return {
            connection : connection,
            setDefaultConnection: setDefaultConnection,
            defaultConnection:defaultConnection,
            getUserConnnections: getUserConnnections,
            setUserConnections: setUserConnections,
            setNewConnection:setNewConnection,
            insertConnection: insertConnection,
            deleteConnections: deleteConnections,
            connectionClick:connectionClick,
            onConnectionSuccess:onConnectionSuccess,
            onConnectionError:onConnectionError
        };
    }());
    
    return connectionsViewModel;
}());
