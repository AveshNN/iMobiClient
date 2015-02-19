/**
 * QuickHistory view model
 */

var app = app || {};

app.QuickHistory = (function () {
    'use strict'

    var displayControl;
    
    // QuickHistory view model
    var quickHistoryViewModel = (function () {
        var quickHistoryItemBarcode;
        
        var show = function (e) {
            quickHistoryItemBarcode = e.view.params.itemBarcode;
            var scanned = document.getElementById(displayControl);
            scanned.innerHTML = quickHistoryItemBarcode;
            
            getItemHistory();
        };
        
        var initial = function(x) {
            displayControl = x;
        };
        
        var getItemHistory = function() {
            var data = "barcode=" + quickHistoryItemBarcode;  
            
            app.Service.ajaxCall("GetBarcodeHistory", data, "app.QuickHistory.setItemHistory");
        };
        
        var setItemHistory = function(list) {
            if (list != null) {
                var returnHistory = new Array(list.length);
                try {
                    for (var i = 0;i < list.length;i++) {
                        var historyTrace = list[i];
                
                        returnHistory[i] = { 
                            ID: typeof historyTrace.Id.toString() != 'undefined' ? historyTrace.Id.toString() : '',
                            TransactionType: typeof historyTrace.TransactionType != 'undefined' ? historyTrace.TransactionType : '',  
                            AtProfile: typeof historyTrace.AtProfile != 'undefined' ? historyTrace.AtProfile : '', 
                            ToProfile: typeof historyTrace.ToProfile != 'undefined' ? historyTrace.ToProfile : '', 
                            Direction: typeof historyTrace.Direction != 'undefined' ? historyTrace.Direction : '', 
                            TxnDate: typeof historyTrace.TxnDate != 'undefined' ? historyTrace.TxnDate : '',  
                            User: typeof historyTrace.User != 'undefined' ? historyTrace.User : '',  
                            IsSystem:  typeof historyTrace.IsSystem != 'undefined' ? historyTrace.IsSystem : ''
                        }
                    }
                }
                catch (e) {
                    alert(e);
                }
		
                try {
                    var control = $("#grouped-listviewshistory");     
            
                    app.ListControl.removeListViewWrapper(control);
                    app.ListControl.applyDataTemplate(control, returnHistory, "#historyItem");
                }
                catch (ex) {
                    alert(ex);
                }
            }
        };
        
        var requestHistory = function() {
            console.log(app.Home.userProfileEmail());
            var data = "items=" + quickHistoryItemBarcode + "&userEmail=" + app.Home.userProfileEmail();
            app.Service.ajaxCall("RequestHistory", data, "app.QuickHistory.callBackHistory");
        };
        
        var callBackHistory = function(result) {
            var response = document.getElementById('resultHistoryRequest');
            
            if (result == true) {
                response.innerHTML = "Report will be emailed";
                alert("Report will be emailed");
            }
            else {
                response.innerHTML = "Error. Please try again";
            }  
            
            var el = response;
            var effect = kendo.fx(el).fadeOut().duration(6000);
            effect.play();
            
            app.mobileApp.navigate('views/itemOptions.html?itemBarcode=' + quickHistoryItemBarcode);
        };
        
        return {
            init : initial,
            show : show,
            getItemHistory: getItemHistory,
            setItemHistory: setItemHistory,
            requestHistory: requestHistory,
            callBackHistory: callBackHistory
            
        };
    }()
    );
    
    return quickHistoryViewModel;
}());
