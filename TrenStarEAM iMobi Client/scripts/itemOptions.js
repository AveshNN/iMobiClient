/**
 * ItemOptions view model
 */

var app = app || {};

app.ItemOption = (function () {
    'use strict'

    var displayControl;
    
    // ItemOptions view model
    var itemOptionsViewModel = (function () {
        var itemOptionItemBarcode;
        
        var show = function (e) {
            itemOptionItemBarcode = e.view.params.itemBarcode;
            var scanned = document.getElementById(displayControl);
            scanned.innerHTML = itemOptionItemBarcode;
        };
        
        var initial = function(x) {
            displayControl = x;
        };
        
        // Navigate to app home
        var navigateItemOptions = function (e) {
            app.mobileApp.navigate(e + itemOptionItemBarcode);
        };
        
        return {
            init : initial,
            show : show,
            navigateItemOptions: navigateItemOptions
            
        };
    }());
    
    return itemOptionsViewModel;
}());

