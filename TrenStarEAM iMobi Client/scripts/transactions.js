/**
 * Transactions view model
 */

var app = app || {};

app.Transactions = (function () {
    'use strict'

    var displayControl;
    
    // Transactions view model
    var transactionsViewModel = (function () {
        var show = function (e) {
            document.getElementById(displayControl).innerHTML = app.User.userProfileDefaultTProfile();           
        };
        
        var initial = function(x) {
            displayControl = x;
        };
        
        var navigateTransactions = function (e) {
            app.mobileApp.navigate(e);
        };
        
        var SmartTransaction = function () {
            var minDate = new Date();
            minDate.toString('yyyy-MM-dd HH:mm:ss'); 
            
            this.ConnectionCode = app.Service.getServiceCode();
            this.Type = "SMARTMOVE";
            this.Origin = "SMARTDEVICE";
            this.DeviceName = app.getDeviceSecureUDID();
            this.FromTProfileId = 0;
            this.FromTProfileCode = "";
            this.AtTProfileId = 0;
            this.ToTProfileId = 0;
            this.AtTProfileCode = "";
            this.ToTProfileCode = "";
            this.AtTProfileDescription = "";
            this.ToTProfileDescription = "";
            this.TransactionDate = minDate;
            this.IsIn = false;
            this.ScanUser = "";
            this.OrderNo = "";
            this.Waybill = "";
            this.VehicleReg = "";
            this.PickSlip = "";
            this.UserSignature = "";
            this.ClientSupervisorSignature = "";
            this.Longitude = app.deviceInfo.deviceGetCurrentLongitude();
            this.Latitude = app.deviceInfo.deviceGetCurrentLatitude();
            this.DriversLicense = "";
            this.Items = [];

        };
        
        var SmartTransactionItems = function(){
            this.Barcode = null;
            this.Kanban = "";
            this.SubItems = [];
        };
        
        var SmartTransactionSubItems = function(){
            this.SubItemBarcode = null;
            this.Quantity = null;
        }
        
        return {
            init : initial,
            show : show,
            navigateTransactions : navigateTransactions,
            SmartTransaction : SmartTransaction,
            SmartTransactionItems : SmartTransactionItems,
            SmartTransactionSubItems: SmartTransactionSubItems
        };
    }());
    
    return transactionsViewModel;
}());
