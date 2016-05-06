/**
 * Service view model
 */

var app = app || {};

app.Service = (function () {
    'use strict'

    var wcfService = "";
    var wcfConnectionCode = "";
    var xhr = null;
    
    // Service view model
    var serviceViewModel = (function () {
        //Default Service to use
        var getService = function() {
            return wcfService;
        };
    
        var setService = function(service) {
            wcfService = service;
        };
        
        var getServiceCode = function() {
            return wcfConnectionCode;
        };
    
        var setServiceCode = function(serviceCode) {
            wcfConnectionCode = serviceCode;
            app.consoleLog("serviceCode:" + serviceCode);
        };
        
        var ajaxCall = function(method, data, callback, spinnerText, service) {
            /*if (app.spinnerService.viewModel.checkSimulator() == false) {
            app.spinnerService.viewModel.spinnerStop();
            }*/
            //Get the default service
            var wcfServiceUrl = getService();
            
            var connectionType = app.deviceInfo.deviceConnection();
            
            if ((service != null) || (service != undefined)) {
                //sets the new service
                wcfServiceUrl = service;                
                
                if (connectionType == "none") {
                    //alert("No internet connection");
                    app.Alert.openAlertWindow("Connection Error", "No internet connection");
                }
                else {
                    if (app.spinnerService.viewModel.checkSimulator() == false) {
                        if (spinnerText === undefined) {
                            spinnerText = "Loading";
                        }
                
                        if (spinnerText === "") {
                            spinnerText = "Loading";
                        }
                
                        app.spinnerService.viewModel.withMessageCallback(spinnerText);
                    }
                    xhr = $.ajax({
                                     type: "POST",
                                     url: wcfServiceUrl + method,
                                     data: data,//JSON.stringify(data),
                                     contentType: "application/json; charset=utf-8",
                                     dataType: "json",
                                     success: function() {
                                         if (app.spinnerService.viewModel.checkSimulator() == false) {
                                             app.spinnerService.viewModel.spinnerStop();
                                         }
                                         
                                         app.TransactionsCreate.callBackSubmitTransaction(true);
                                         
                                     },
                                     error: function () {
                                         if (app.spinnerService.viewModel.checkSimulator() == false) {
                                             app.spinnerService.viewModel.spinnerStop();
                                         }
                                         
                                         app.TransactionsCreate.callBackSubmitTransaction(false);
                                     },
                                 });
                }
            }
            else {
                data = data + "&connectionCode=" + getServiceCode();
            
                if (connectionType == "none") {
                    //alert("No internet connection");
                    app.Alert.openAlertWindow("Connection Error", "No internet connection");
                }
                else {
                    if (app.spinnerService.viewModel.checkSimulator() == false) {
                        if (spinnerText === undefined) {
                            spinnerText = "Loading";
                        }
                
                        if (spinnerText === "") {
                            spinnerText = "Loading";
                        }
                
                        app.spinnerService.viewModel.withMessageCallback(spinnerText);
                    }
                    
                    xhr = $.ajax({
                                     type:'POST',
                                     url: wcfServiceUrl + method,
                                     data: data,
                                     jsonpCallback: callback,
                                     contentType: 'application/json; charset=utf-8',
                                     dataType: "jsonp",
                                     success: function(result) {
                                         if (app.spinnerService.viewModel.checkSimulator() == false) {
                                             app.spinnerService.viewModel.spinnerStop();
                                         }
                                         return result;
                                     },
                                     error: function (result) {
                                         if (app.spinnerService.viewModel.checkSimulator() == false) {
                                             app.spinnerService.viewModel.spinnerStop();
                                         }
                                         return result;
                                     },
                                 });
                }
            }
        };
        
        var abortAjaxCall = function() {
            if (xhr != undefined || xhr != null) {
                xhr.abort();
                
                app.Alert.openAlertWindow("Cancel", "Cancelling Request");
                if (app.spinnerService.viewModel.checkSimulator() == false) {
                    app.spinnerService.viewModel.spinnerStop();
                }
            }
        }
        
        return {
            getService : getService,
            setService : setService,
            getServiceCode: getServiceCode,
            setServiceCode: setServiceCode,
            ajaxCall:ajaxCall,
            abortAjaxCall : abortAjaxCall
            
        };
    }());
    
    return serviceViewModel;
}());
