/**
 * ScanBarode view model
 */
var app = app || {};

app.ScanBarcode = (function () {
    'use strict'

    var displayControl;
    var errorControl;
    var $scannedBarcode;
    
    // Navigate to app home
    var navigateItemOptions = function (barcode) {
        app.mobileApp.navigate('views/itemOptions.html?itemBarcode=' + barcode);
    };
    
    // ScanBarcode view model
    var scanBarcodeViewModel = (function () {
        var validate = function(e) {
            var scanned = e.value.toUpperCase();
            if (ValidateBarcode(scanned) == false) {
                navigator.notification.vibrate(3000);
                document.getElementById(errorControl).innerHTML = "Invalid Barcode";
					
                var el = document.getElementById(errorControl);
                var effect = kendo.fx(el).fadeOut().duration(6000);
                effect.play();
            }
            else {
                navigateItemOptions(scanned);
            }
        };
        
        var scanItem = function() {
            cordova.plugins.barcodeScanner.scan(
                function(result) {
                    if (!result.cancelled) {
                        if (ValidateBarcode(result.text)) {
                            var scanned = document.getElementById(displayControl);
                            scanned.value = result.text;
                            navigateItemOptions(scanned.value);
                        }
                        else {
                            var clearControl = document.getElementById(displayControl);
                            clearControl.value = "";
                            navigator.notification.vibrate(3000);
                            document.getElementById(errorControl).innerHTML = "Invalid Barcode";
					
                            var el = document.getElementById(errorControl);
                            var effect = kendo.fx(el).fadeOut().duration(6000);
                            effect.play();
                        }
                    }
                }, 
                function(error) {
                    console.log("Scanning failed: " + error);
                }
                );
        };
        
         var show = function () {
             $scannedBarcode = $('#txtBarcode');
             $scannedBarcode.val('');
        };
        
        var initial = function(x, y) {
            displayControl = x;
            errorControl = y;
            
        };
        
        return {
            scanItem: scanItem,
            validateBarcode: validate,
            init : initial,
            show : show
            
        };
    }());
    
    return scanBarcodeViewModel;
}());
