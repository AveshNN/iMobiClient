/**
 * Service view model
 */

var app = app || {};

app.Service = (function () {
    'use strict'

    var wcfService = "";
    var wcfConnectionCode = "";
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
        
        var ajaxCall = function(method, data, callback, spinnerText) {
            /*if (app.spinnerService.viewModel.checkSimulator() == false) {
                app.spinnerService.viewModel.spinnerStop();
            }*/
            
            var wcfServiceUrl = getService();
            data = data + "&connectionCode=" + getServiceCode();
            
            var connectionType = app.deviceInfo.deviceConnection();
            
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
                
                    app.spinnerService.viewModel.withMessage(spinnerText);
                }
                $.ajax({
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
        };
        
        return {
            getService : getService,
            setService : setService,
            getServiceCode: getServiceCode,
            setServiceCode: setServiceCode,
            ajaxCall:ajaxCall
            
        };
    }());
    
    return serviceViewModel;
}());
