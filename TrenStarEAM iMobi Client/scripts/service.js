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
            console.log("serviceCode:" + serviceCode);
        };
        
        var ajaxCall = function(method, data, callback) {
            var wcfServiceUrl = getService();
            data = data + "&connectionCode=" + getServiceCode();
            console.log(data);
            $.ajax({
                       type:'POST',
                       url: wcfServiceUrl + method,
                       data: data,
                       jsonpCallback: callback,
                       contentType: 'application/json; charset=utf-8',
                       dataType: "jsonp",
                       success: function(result) {
                           return result;
                       },
                       error: function (result) {
                           return result;
                       },
                   });
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
