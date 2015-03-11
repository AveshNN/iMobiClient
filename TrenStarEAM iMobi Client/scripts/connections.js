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
                tx.executeSql("SELECT * FROM Connection", [], rendercon, app.onError);
            });
            
            var rendercon = function (tx, rs) {
                var connectionSet = false;
                
                if (rs.rows.length > 0) {
                    for (var i = 0; i < rs.rows.length; i++) {
                        var connectionName = rs.rows.item(i).ConnectionName;
                        connectionSet = rs.rows.item(i).IsSet;
                        app.consoleLog(connectionName + ":" + connectionSet);
                        if ((connectionSet == "true") || (connectionSet == "1")) {
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
            //Create the Database
            //app.Database.openDB();
            //app.Database.deleteTable();
            //app.Database.createTable();
            
            var db = app.Database.db();
               
            db.transaction(function(tx) {
                tx.executeSql("SELECT * FROM Connection", [], renderdef, app.onError);
            });
            
            var renderdef = function (tx, rs) {
                if (rs.rows.length > 0) {
                    for (var i = 0; i < rs.rows.length; i++) {
                        if (rs.rows.item(i).ConnectionCode == connectionCode) {
                            app.Service.setService(rs.rows.item(i).WCFConnection); 
                            
                            app.consoleLog(app.Service.getService());
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
                              ["DEFAULT", "DEF", "http://trenstaream.trenstar.co.za/TrenstarEAM.iMobile.Service.Client/Service1.svc/", true],
                              app.onSuccess,
                              app.onError);
            });
        };
        
        var setNewConnection = function(connectionName, connectionCode) {
            $('#btnLogin').text('Login');
            var db = app.Database.db();
    
            db.transaction(function(tx) {
                tx.executeSql("SELECT * FROM Connection", [], rendernew, app.onError);
            });
            
            if (connectionCode != null) {
                app.consoleLog("setNewConnection= " + connectionCode);
                var rendernew = function (tx, rs) {
                    app.consoleLog("(rs.rows.length=" + rs.rows.length);
                    if (rs.rows.length > 0) {
                        /*for (var i = 0; i < rs.rows.length; i++) {
                        if (rs.rows.item(i).ConnectionCode == connectionCode) {
                        $('#' + connectionCode).removeClass('connectionSelect');    
                        $('#' + connectionCode).addClass('connectionSelected');
                        alert(connectionName);
                        }
                        else {
                        $('#' + rs.rows.item(i).ConnectionCode).removeClass('connectionSelected');    
                        $('#' + rs.rows.item(i).ConnectionCode).addClass('connectionSelect');
                        }
                        }*/
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
            
            app.Service.ajaxCall("GetUserConnections", data, "app.Connections.setUserConnections", "Getting Connections");
        };
    
        var setUserConnections = function(list) {
            var availableConnections = [];
            
            //Create the Database
            //app.Database.openDB();
            //app.Database.deleteTable();
            //app.Database.createTable();
            
            var db = app.Database.db();
            
            var found = false;
            
            if (app.spinnerService.viewModel.checkSimulator() == false) {
            app.spinnerService.viewModel.withMessage("Applying User Connections");
            }
            
            db.transaction(function(tx) {
                tx.executeSql("SELECT * FROM Connection", [], renders, app.onError);
            });
            
            var renders = function (tx, rs) {
                if (rs.rows.length > 0) {
                    var connectionSet = false;
                    for (var i = 0;i < list.length;i++) {
                        availableConnections.push({ConnectionName:list[i].Connection, ConnectionCode:list[i].ConnectionCode});
                            
                        for (var j = 0; j < rs.rows.length; j++) {
                            if (rs.rows.item(j).ConnectionCode == list[i].ConnectionCode) {
                                found = true;
                                app.consoleLog("Found: " + list[i].ConnectionCode);
                                
                                break;
                            }
                        }
                        if (found == false) {
                            app.Connections.insertConnection(list[i].Connection, list[i].ConnectionCode);
                            if (connectionSet == false) {
                                app.consoleLog("set" + list[i].Connection);
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
                                if ((rss.rows.item(i).IsSet == "true") || (rss.rows.item(i).IsSet == "1")) {
                                    app.consoleLog("Current set:" + rss.rows.item(i).ConnectionCode);
                                    $('#' + rss.rows.item(i).ConnectionCode).removeClass('connectionSelect');    
                                    $('#' + rss.rows.item(i).ConnectionCode).addClass('connectionSelected');
                                
                                    $('#loginStatusConnection').text(rss.rows.item(i).ConnectionName);
                                    app.Service.setServiceCode(rs.rows.item(i).ConnectionCode); 
                                }
                            }
                        }
                        
                        /*app.consoleLog(availableConnections.length);
                        if (availableConnections.length === 1) {
                            app.consoleLog("hide connections");
                            $('#btnConnections').removeClass('connections-button');
                            $('#btnConnections').addClass('connections-button_hide');
                        }
                        else {
                            $('#btnConnections').removeClass('connections-button_hide');
                            $('#btnConnections').addClass('connections-button');
                        }*/
                    }
                }
                if (app.spinnerService.viewModel.checkSimulator() == false) {
                app.spinnerService.viewModel.spinnerStop();
                }
            };
        };
        
        var insertConnection = function(connectionName, connectionCode) {
            app.consoleLog("insertConnection:" + connectionName);
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
