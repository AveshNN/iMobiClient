/**
 * QuickItem view model
 */

var app = app || {};

app.QuickItem = (function () {
    'use strict'

    var displayControl;
    
    // QuickItem view model
    var quickItemViewModel = (function () {
        var quickItemItemBarcode;
        
        var show = function (e) {
            quickItemItemBarcode = e.view.params.itemBarcode;
            var scanned = document.getElementById(displayControl);
            scanned.innerHTML = quickItemItemBarcode;
            
            getItemDetails();
        };
        
        var initial = function(x) {
            displayControl = x;
        };
        
       
        
        var getItemDetails = function() {
            var data = "barcode=" + quickItemItemBarcode;  
            
            app.Service.ajaxCall("GetBarcodeInformationJSONP", data, "app.QuickItem.setItemDetails", "Getting item info");

        };
        
        var setItemDetails = function(list) {
            if (list != null) {
                for (var i = 0;i < list.length;i++) {
                    var item = list[i];
                    var onsiteStatusTextElem = document.getElementById('onsiteStatusText');
                    onsiteStatusTextElem.innerHTML = item.OnsiteStatus;
                    onsiteStatusTextElem.style.display = 'block';
                
                    document.getElementById('atProfileText').value = item.AtTProfile;
                    document.getElementById('atProfileAreaText').value = item.AtTProfileArea;
                    document.getElementById('toProfileText').value = item.ToTProfile;
                    document.getElementById('toProfileAreaText').value = item.ToTProfileArea;
                    document.getElementById('lastTxnDateText').value = item.LastTxnDate;
                    document.getElementById('statusText').value = item.Status;
                    document.getElementById('conditionText').value = item.Condition;
                    document.getElementById('daysOnSiteText').value = item.DaysOnSite;
                }
            }
            else {
                document.getElementById('itemDetailStatus').innerHTML = "No Information Available";
                var el = document.getElementById('itemDetailStatus');
                var effect = kendo.fx(el).fadeOut().duration(6000);
                effect.play();
            }
        };
        return {
            init : initial,
            show : show,
            getItemDetails: getItemDetails,
            setItemDetails: setItemDetails
            
        };
    }()
    );
    
    return quickItemViewModel;
}());