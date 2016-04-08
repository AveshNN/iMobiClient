/**
 * TransactionsCreate view model
 */

var app = app || {};

app.TransactionsCreate = (function () {
    'use strict'

    var displayControl;
    var displayControlTransactionType;
    var type;
    var groupedCurrentArea = [];
    var itemScannedList = [];
    var itemScannedListLinks = [];
    var sigCapture = null;

    // Transactions Create view model
    var transactionsCreateViewModel = (function () {
        var smartTransaction;
         
        var show = function (e) {
            document.getElementById(displayControl).innerHTML = 
            document.getElementById('userProfileNameTransactionsFromArea').innerHTML = 
            document.getElementById('userProfileNametransactionsNextArea').innerHTML = 
            document.getElementById('userProfileNametransactionsDetails').innerHTML = 
            document.getElementById('userProfileNametransactionsScan').innerHTML =
            document.getElementById('userProfileNametransactionsSign').innerHTML =
            document.getElementById('userProfileNametransactionsSummary').innerHTML = app.User.userProfileDefaultTProfile(); 
            
            type = e.view.params.type;
            app.TransactionsCreate.resetAllItems();
            
            var userDisplay;
            switch (type) {
                case "MOVEIN":
                    smartTransaction = new app.Transactions.SmartTransaction();
                    smartTransaction.Type = "SMARTMOVE";
                    smartTransaction.ScanUser = app.User.userProfileLoginName();
                    userDisplay = "Receive Items";
                    smartTransaction.IsIn = true;
                    break;
                case "MOVEOUT":
                    smartTransaction = new app.Transactions.SmartTransaction();
                    smartTransaction.Type = "SMARTMOVE";
                    smartTransaction.ScanUser = app.User.userProfileLoginName();
                    userDisplay = "Dispatch Items";
                    smartTransaction.IsIn = false;
                    break;
                case "LINKIN":
                    smartTransaction = new app.Transactions.SmartTransaction();
                    smartTransaction.Type = "SMARTLINK";
                    smartTransaction.ScanUser = app.User.userProfileLoginName();
                    userDisplay = "Link Receive";
                    smartTransaction.IsIn = true;
                    break;
                case "LINKOUT":
                    smartTransaction = new app.Transactions.SmartTransaction();
                    smartTransaction.Type = "SMARTLINK";
                    smartTransaction.ScanUser = app.User.userProfileLoginName();
                    userDisplay = "Link Dispatch";
                    smartTransaction.IsIn = false;
                    break;
            }
            
            displayControlTransactionType = document.getElementById("transactionTypeCurrentArea");
            displayControlTransactionType.innerHTML = 
            document.getElementById('transactionTypeFromArea').innerHTML =
            document.getElementById('transactionTypeNextArea').innerHTML = 
            document.getElementById('transactionTypeDetails').innerHTML = 
            document.getElementById('transactionTypeScan').innerHTML =
            document.getElementById('transactionTypeSign').innerHTML =
            document.getElementById('transactionTypeSummary').innerHTML =userDisplay;
            
            var trackingProfileId = app.User.userProfileDefaultTProfileId();
            
            if (groupedCurrentArea.length > 0) {
                setCurrentArea(null);
            }
            else {
                getCurrentArea(trackingProfileId);
            }
        };
        
        var initial = function(x) {
            console.log("init");
            displayControl = x;
        }
        
        var getFromArea = function(x) {
            var data = "tpL1TProfileId=" + x;  
            
            app.Service.ajaxCall("GetNextTrackingProfile", data, "app.TransactionsCreate.setFromArea", "Getting Areas");
        };
        
        var setFromArea = function(list) {
            var groupedFromArea = [];
            
            if (list != null) {
                for (var i = 0;i < list.length;i++) {
                    var area = list[i];
                
                    groupedFromArea.push({ TProfileId: area.TProfileIdTo, Description: area.Description });    
                }
            }
            if (groupedFromArea.length == 0) {
                groupedFromArea.push({ TProfileId: -1, Description: "No Areas Available" });       
            }
            
            var control = $("#grouped-listviewsFromArea");            
            app.ListControl.removeListViewWrapper(control);
        
            app.ListControl.applyDataTemplate(control, groupedFromArea, "#customListViewTemplateFromArea");
        };
        
        var getCurrentArea = function(x) {
            var data = "tpL1TProfileId=" + x;  
            
            app.Service.ajaxCall("GetCurrentTrackingProfile", data, "app.TransactionsCreate.setCurrentArea", "Getting Areas");
        };
        
        var setCurrentArea = function(list) {
            if (list != null) {
                for (var i = 0;i < list.length;i++) {
                    var area = list[i];
                
                    groupedCurrentArea.push({ TProfileId: area.TProfileId, Description: area.Description });    
                }
            }
            if (groupedCurrentArea.length == 0) {
                groupedCurrentArea.push({ TProfileId: -1, Description: "No Areas Available" });       
            }
            
            var control = $("#grouped-listviewsCurrentArea");            
            app.ListControl.removeListViewWrapper(control);
        
            app.ListControl.applyDataTemplate(control, groupedCurrentArea, "#customListViewTemplateCurrentArea");
        };
        
        var getNextArea = function(x) {
            var data = "tpL1TProfileId=" + x;  
            
            app.Service.ajaxCall("GetNextTrackingProfile", data, "app.TransactionsCreate.setNextArea", "Getting Areas");
        };
        
        var setNextArea = function(list) {
            var groupedNextArea = [];
            
            if (list != null) {
                for (var i = 0;i < list.length;i++) {
                    var area = list[i];
                
                    groupedNextArea.push({ TProfileId: area.TProfileIdTo, Description: area.Description });    
                }
            }
            if (groupedNextArea.length == 0) {
                groupedNextArea.push({ TProfileId: -1, Description: "No Areas Available" });       
            }
            
            var control = $("#grouped-listviewsNextArea");            
            app.ListControl.removeListViewWrapper(control);
        
            app.ListControl.applyDataTemplate(control, groupedNextArea, "#customListViewTemplateNextArea");
        };
        
        var selectFromArea = function (fromTProfileId, fromDescription) {
            if ((fromTProfileId != "-1") && (fromTProfileId != "${TProfileId}")) {
                smartTransaction.FromTProfileId = fromTProfileId;
                smartTransaction.FromTProfileDescription = fromDescription;
            }
            
            //Move forward to Next Area
            app.TransactionsCreate.resetAllItems();
            
            if (smartTransaction.IsIn === false) {
                var trackingProfileId = app.User.userProfileDefaultTProfileId();
                app.TransactionsCreate.getNextArea(trackingProfileId);
            }
            else {
                app.TransactionsCreate.setNextArea(null);
            }
            
            document.getElementById('userCurrentAreatransactionsNextArea').innerHTML = smartTransaction.AtTProfileDescription;
            
            app.TransactionsCreate.navigateTransactions("transactionsNextArea");
        };
        
        var selectCurrentArea = function (currentTProfileId, currentDescription) {
            smartTransaction.AtTProfileId = currentTProfileId;
            smartTransaction.AtTProfileDescription = currentDescription;
            
            //Move forward to Next Area
            app.TransactionsCreate.resetAllItems();
            
            var trackingProfileId = app.User.userProfileDefaultTProfileId();
            if (smartTransaction.IsIn === false) {
                app.TransactionsCreate.setFromArea(null);
            }
            else {
                app.TransactionsCreate.getFromArea(trackingProfileId);
            }
            
            document.getElementById('userCurrentAreatransactionsFromArea').innerHTML = smartTransaction.AtTProfileDescription;
            
            app.TransactionsCreate.navigateTransactions("transactionsFromArea");
        };
        
        var selectNextArea = function (nextTProfileId, nextDescription) {
            console.log("hi");
            if ((nextTProfileId != "-1") && (nextTProfileId != "${TProfileId}")) {
                smartTransaction.ToTProfileId = nextTProfileId;
                smartTransaction.ToTProfileDescription = nextDescription;
            }
            //Move forward to Details
            document.getElementById('userCurrentAreatransactionsDetails').innerHTML = smartTransaction.AtTProfileDescription;
            
            var nextAreaControl = document.getElementById('userNextAreatransactionsDetails');
            nextAreaControl.innerHTML = "In Transaction";
            console.log("smartTransaction.ToTProfileId: " + smartTransaction.ToTProfileId);
            if (smartTransaction.ToTProfileId != "0") {
                nextAreaControl.innerHTML = smartTransaction.ToTProfileDescription;
            }
            
            app.TransactionsCreate.resetAllItems();
            
            document.getElementById('orderNumber').value = "";
            document.getElementById('vehicleReg').value = "";
            document.getElementById('waybill').value = "";
            document.getElementById('pickSlip').value = "";
            
            app.TransactionsCreate.navigateTransactions("transactionsDetails");
        };
        
        var selectTransactionDetails = function() {
            smartTransaction.OrderNo = document.getElementById('orderNumber').value;
            smartTransaction.Waybill = document.getElementById('vehicleReg').value;
            smartTransaction.VehicleReg = document.getElementById('waybill').value;
            smartTransaction.PickSlip = document.getElementById('pickSlip').value;
            
            if ((smartTransaction.OrderNo === "") && (smartTransaction.Waybill === "") && (smartTransaction.VehicleReg === "") && (smartTransaction.PickSlip === ""))
            {
                app.Alert.openAlertWindow("Transaction Data", "You have not entered any transaction data");
            }
            else{
            
            
            //Move forward to Scanning
            document.getElementById('userCurrentAreatransactionsScan').innerHTML = smartTransaction.AtTProfileDescription;
            var nextAreaControl = document.getElementById('userNextAreatransactionsScan');
            nextAreaControl.innerHTML = "In Transaction";
            
            if (smartTransaction.ToTProfileId != "0") {
                nextAreaControl.innerHTML = smartTransaction.ToTProfileDescription;
            }
            
            app.TransactionsCreate.resetAllItems();            
            app.TransactionsCreate.navigateTransactions("transactionsScan");
                }
        };
        
        var selectTransactionEnd = function() {
            document.getElementById('userCurrentAreatransactionsSign').innerHTML = smartTransaction.AtTProfileDescription;
            var nextAreaControl = document.getElementById('userNextAreatransactionsSign');
            nextAreaControl.innerHTML = "In Transaction";
            
            if (smartTransaction.ToTProfileId != "0") {
                nextAreaControl.innerHTML = smartTransaction.ToTProfileDescription;
            }
            
            app.TransactionsCreate.navigateTransactions("transactionsEnd");
        };
        
        var selectTransactionSummary = function() {
            document.getElementById('userCurrentAreatransactionsSummary').innerHTML = smartTransaction.AtTProfileDescription;
            var nextAreaControl = document.getElementById('userNextAreatransactionsSummary');
            nextAreaControl.innerHTML = "In Transaction";
            
            if (smartTransaction.ToTProfileId != "0") {
                nextAreaControl.innerHTML = smartTransaction.ToTProfileDescription;
            }
            
            var itemSummary = [];
            
            if (itemScannedListLinks.length > 0) {
                for (var l = 0; l < itemScannedListLinks.length; l++) {
                    itemSummary.push({MainItem: itemScannedListLinks[l].MainItem, Item:itemScannedListLinks[l].Item, Quantity: itemScannedListLinks[l].Quantity});
                }
            }
            else {
                for (var m = 0; m < itemScannedList.length; m++) {
                    itemSummary.push({MainItem: itemScannedList[m].Item, Item:"Unlinked", Quantity: ""});
                }
            }
            
            if (itemSummary.length > 0){
            var control = $("#grouped-itemTransactionSummary");            
            app.ListControl.removeListViewWrapper(control);
            if (smartTransaction.Type === "SMARTMOVE") {        
                app.ListControl.applyDataTemplateGroupBy(control, itemSummary, "#customListItemTransactionSummaryNoLink", "MainItem");
            }
            else {
                app.ListControl.applyDataTemplateGroupBy(control, itemSummary, "#customListItemTransactionSummary", "MainItem");
            }
            
            app.TransactionsCreate.navigateTransactions("transactionsSummary");
                }
            else{
                app.Alert.openAlertWindow("Scan", "Please scan a barcode");
            }
        };
        
        var selectTransactionLicense = function() {
            var image = document.getElementById('driversLicenseImage');
                image.src = "";
            app.TransactionsCreate.navigateTransactions("transactionsLicense");
            
        };
        
        var selectTransactionSign = function(signTypeDescription, signType) {
            var nextAreaControl = document.getElementById('signTypeDescription');
            nextAreaControl.innerHTML = signTypeDescription;
            
            $("#signature").height("100%"); 
            sigCapture = new SignatureCapture("signature", signType);
            sigCapture.clear();
            
            app.TransactionsCreate.navigateTransactions("transactionsSignature");
        };
        
        var selectTransactionSaveSignature = function() {
            var signatureType = sigCapture.signatureType;
            console.log(sigCapture);
            if (signatureType === "USER"){
                smartTransaction.UserSignature = sigCapture.toString();
            }
            else{
                smartTransaction.ClientSupervisorSignature = sigCapture.toString();
            }
            
            app.TransactionsCreate.navigateTransactions("transactionsEnd");
            
        };
        
        var selectTransactionSubmit = function(){
            console.log(smartTransaction);
            
            for (var m = 0; m<itemScannedList.length; m++){
                var sti = new app.Transactions.SmartTransactionItems();
                sti.Barcode = itemScannedList[m].Item;
                
                for (var l = 0; l<itemScannedListLinks.length; l++){
                    if (itemScannedListLinks[l].MainItem === sti.Barcode){
                        var stil = new app.Transactions.SmartTransactionSubItems();
                        stil.SubItemBarcode = itemScannedListLinks[l].Item;
                        stil.Quantity = itemScannedListLinks[l].Quantity;
                        sti.SubItems.push(stil);
                    }
                }
                
                smartTransaction.Items.push(sti);
            }
            console.log(smartTransaction);
            
           var data = '{"transaction":' + JSON.stringify(smartTransaction) + '}';
            
            //data = '{transaction":"{Type":"SMARTMOVE","Origin":"SMARTDEVICE","DeviceName":"e0101010d38bde8e6740011221af335301010333","AtTProfileId":"5994","ToTProfileId":"0","AtTProfileCode":"","ToTProfileCode":"","AtTProfileDescription":"TSDROS2AwaitingParts","ToTProfileDescription":"","TransactionDate":"2016-01-29T130952.827Z","IsIn":"true","OrderNo":"","Waybill":"","VehicleReg":"","PickSlip":"","UserSignature":"","ClientSupervisorSignature":"","SmartTransactionItems":"[{Barcode":"RATT1A000002M","Kanban":"","SmartTransactionSubItems":"[]}]","OrderNumber":"}}';
            app.Service.ajaxCall("SubmitTransaction", data, "", "Submitting Transaction", "http://trenstaream.trenstar.co.za/TrenstarEAM.iMobile.Service.Client/Transaction.svc/");
            
            app.Transactions.navigateTransactions('views/transactions.html');
            
            smartTransaction = null;
            
        };
        
        var selectTransactionQuantity = function() {
            var quantity = document.getElementById("txttransactionsScanLinkQuantity");
            
            var numbers = /^[0-9]+$/;  
            if (quantity.value.match(numbers)) {  
                var theMainItem = document.getElementById("mainIteml").innerHTML;
                var theLinkItem = document.getElementById("linkItem").innerHTML;
            
                itemScannedListLinks.push({MainItem: theMainItem, Item:theLinkItem, Quantity: quantity.value});
                app.TransactionsCreate.displayItemsScanned(false, theMainItem);
                console.log(itemScannedListLinks);
            
                app.TransactionsCreate.navigateTransactions("transactionsScanLinks");
            }  
            else {  
                var validateQuantity = document.getElementById("numbericValidation");
                navigator.notification.vibrate(3000);
                validateQuantity.innerHTML = "Invalid Quatity";
                var effect = kendo.fx(validateQuantity).fadeOut().duration(6000);
                effect.play();
                quantity.focus();
                return false;  
            }  
        };
        
        var transactionsScanInit = function(txttransactionsScanBarcode) {
            document.getElementById(txttransactionsScanBarcode).focus();
        };
        
        var navigateTransactions = function (e) {  
            app.TransactionsCreate.scrollToTop();
            app.mobileApp.navigate("#" + e + "?type=" + type);
            //app.mobileApp.navigate("#" + e);
            
        };
        
        var navigatetoLink = function(item) {
            if (smartTransaction.Type === "SMARTLINK") {
                document.getElementById("mainItem").innerHTML = item;
                app.TransactionsCreate.displayItemsScanned(false, item);
                app.TransactionsCreate.navigateTransactions("transactionsScanLinks");
            }
        };
        
        var scanCameraMain = function () {
            cordova.plugins.barcodeScanner.scan(
                function (result) {
                    if (!result.cancelled) {
                        if (ValidateBarcode(result.text)) {
                            app.TransactionsCreate.validateDuplicate(result.text, true);
                        }
                        else {
                            var clearControl = document.getElementById("displayValidation");
                            navigator.notification.vibrate(3000);
                            clearControl.innerHTML = "Invalid Barcode";
                            var effect = kendo.fx(clearControl).fadeOut().duration(6000);
                            effect.play();
                        }
                    }
                },
                function (error) {
                    app.consoleLog("Scanning failed: " + error);
                }
                );
        };
        
        var scanCameraLink = function () {
            cordova.plugins.barcodeScanner.scan(
                function (result) {
                    if (!result.cancelled) {
                        app.TransactionsCreate.validateDuplicate(result.text, false);
                        /*if (ValidateBarcode(result.text)) {
                        app.TransactionsCreate.validateDuplicate(result.text, false);
                        }
                        else {
                        var clearControl = document.getElementById("displayValidation");
                        navigator.notification.vibrate(3000);
                        clearControl.innerHTML = "Invalid Barcode";
                        var effect = kendo.fx(clearControl).fadeOut().duration(6000);
                        effect.play();
                        }*/
                    }
                },
                function (error) {
                    app.consoleLog("Scanning failed: " + error);
                }
                );
        };
        
        var validateItem = function (e, isMainItem) {
            var scanned = e.value.toUpperCase();
            e.value = "";
            e.focus();
            //only validate barcode for main items
            if (isMainItem) {
                if (ValidateBarcode(scanned) == false) {
                    navigator.notification.vibrate(3000);
                    var errorControl = document.getElementById("displayValidation");
                    errorControl.innerHTML = "Invalid Barcode";
                
                    var effect = kendo.fx(errorControl).fadeOut().duration(6000);
                    effect.play();
                }
                else {
                    app.TransactionsCreate.validateDuplicate(scanned, isMainItem);
                }
            }
            else {
                app.TransactionsCreate.validateDuplicate(scanned, isMainItem);
            }
        };
        
        //Validate the item for duplicates.
        //if its the link item, then also check if the link item was scanned as the main item
        var validateDuplicate = function(item, isMainItem) {
            var barcodeFound = false;
            if (isMainItem) {
                for (var x = 0; x < itemScannedList.length; x++) {
                    if (itemScannedList[x].Item === item) {
                        barcodeFound = true;
                        break;
                    }
                }
            }
            else {
                /*for (var y = 0; x < itemScannedList.length; y++) {
                    if (itemScannedList[y].Item === item) {
                        barcodeFound = true;
                        break;
                    }
                }*/
                
                var mainItem = document.getElementById("mainItem").innerHTML;
                for (var z = 0; z < itemScannedListLinks.length; z++) {
                    if (itemScannedListLinks[z].MainItem === mainItem) {
                        if (itemScannedListLinks[z].Item === item) {
                            barcodeFound = true;
                            break;
                        }
                    }
                }
            }
            
            if (!barcodeFound) {
                if (isMainItem) {
                    itemScannedList.push({Item:item});
                    app.TransactionsCreate.displayItemsScanned(isMainItem, null);
                
                    if (smartTransaction.Type === "SMARTLINK") {
                        document.getElementById("mainItem").innerHTML = item;
                        app.TransactionsCreate.displayItemsScanned(isMainItem, item);
                        app.TransactionsCreate.displayItemsScanned(false, item);
                        
                        app.TransactionsCreate.navigateTransactions("transactionsScanLinks");
                    }
                }
                else {
                    var theMainItem = document.getElementById("mainItem").innerHTML;
                    
                    document.getElementById("mainIteml").innerHTML = theMainItem;
                    document.getElementById("linkItem").innerHTML = item;
                    document.getElementById("txttransactionsScanLinkQuantity").value = 1;
                    
                    app.TransactionsCreate.navigateTransactions("transactionsScanLinksQuantity");
                }
            }
            else {
                var errorControl = document.getElementById("displayValidation");
                errorControl.innerHTML = "Duplicate Barcode";
                
                var effect = kendo.fx(errorControl).fadeOut().duration(6000);
                effect.play();
            }
        };
        
        var displayItemsScanned = function(isMainItem, item) {
            var control;
            if (isMainItem) {
                control = $("#grouped-Barcodes");            
                app.ListControl.removeListViewWrapper(control);
        
                app.ListControl.applyDataTemplate(control, itemScannedList, "#customListBarcodeScanned");
            
                document.getElementById('sumOfScannedItems').value = itemScannedList.length;
            }
            else {
                control = $("#grouped-BarcodesLinks");            
                app.ListControl.removeListViewWrapper(control);
        
                var mainItemLinks = [];
                if (item == null) {
                    item = document.getElementById("mainItem").innerHTML;
                }
                
                for (var x = 0; x < itemScannedListLinks.length; x++) {
                    if (itemScannedListLinks[x].MainItem === item) {
                        mainItemLinks.push(itemScannedListLinks[x]);
                    }
                }
                app.ListControl.applyDataTemplate(control, mainItemLinks, "#customListBarcodeScannedLinks");
            
                document.getElementById('sumOfScannedItemsLinks').value = mainItemLinks.length;
            }
        };
        
        var removeScannedItem = function(item, isMainItem) {
            if (isMainItem) {
                for (var x = 0; x < itemScannedList.length; x++) {
                    if (itemScannedList[x].Item == item) {
                        itemScannedList.splice(x, 1);
                    }
                }
            }
            else {
                for (var y = 0; y < itemScannedListLinks.length; y++) {
                    if (itemScannedListLinks[y].Item == item) {
                        itemScannedListLinks.splice(y, 1);
                    }
                }
            }
            app.TransactionsCreate.displayItemsScanned(isMainItem, null);
        };
        
        var clearAllScannedItems = function(isMainItem) {
            if (isMainItem) {
                itemScannedList = [];
                itemScannedListLinks = [];
                app.TransactionsCreate.displayItemsScanned(isMainItem, null);
            }
            else {
                var theMainItem = document.getElementById("mainItem").innerHTML;
                console.log(itemScannedListLinks);
                for (var y = 0; y < itemScannedListLinks.length; y++) {
                    if (itemScannedListLinks[y].MainItem === theMainItem) {
                        itemScannedListLinks.splice(y, 1);
                    }
                }
                app.TransactionsCreate.displayItemsScanned(isMainItem, theMainItem);
            }
        };
        
        var resetAllItems = function() {
            itemScannedList = [];
            itemScannedListLinks = [];
            app.TransactionsCreate.displayItemsScanned(true, null);  
            app.TransactionsCreate.displayItemsScanned(false, null);
            
        };
        
        var takePicture = function(){
             navigator.camera.getPicture(takePictureSuccess, takePictureFail, {
                                                       quality: 50,
                                                       destinationType: Camera.DestinationType.DATA_URL,
                                                       //destinationType: Camera.DestinationType.FILE_URI,
                                                       correctOrientation: true
                                }); 
        };
        
        var takePictureSuccess = function(imageData){
            var image = document.getElementById('driversLicenseImage');
                image.src = "data:image/jpeg;base64," + imageData;
    
                smartTransaction.DriversLicense = imageData;
        };
        
        var takePictureFail = function(imageData){
            smartTransaction.DriversLicense = "";
        };
        
        var scrollToTop = function() {
            $(".km-scroll-container").css("-webkit-transform", "");
        };
        
        return {
            init : initial,
            show : show,
            navigateTransactions : navigateTransactions,
            getFromArea: getFromArea,
            setFromArea : setFromArea,
            getCurrentArea : getCurrentArea,
            setCurrentArea : setCurrentArea,
            getNextArea : getNextArea,
            setNextArea : setNextArea,
            selectFromArea: selectFromArea,
            selectCurrentArea: selectCurrentArea,
            selectNextArea : selectNextArea,
            selectTransactionDetails : selectTransactionDetails,
            scanCameraMain : scanCameraMain,
            scanCameraLink : scanCameraLink,
            displayItemsScanned : displayItemsScanned,
            removeScannedItem : removeScannedItem,
            clearAllScannedItems : clearAllScannedItems,
            validateItem : validateItem,
            validateDuplicate : validateDuplicate,
            transactionsScanInit : transactionsScanInit,
            resetAllItems : resetAllItems,
            navigatetoLink : navigatetoLink,
            selectTransactionSign : selectTransactionSign,
            selectTransactionSubmit : selectTransactionSubmit,
            selectTransactionSaveSignature : selectTransactionSaveSignature,
            selectTransactionEnd : selectTransactionEnd,
            selectTransactionQuantity : selectTransactionQuantity,
            selectTransactionSummary : selectTransactionSummary,
            takePicture:takePicture,
            takePictureSuccess:takePictureSuccess,
            takePictureFail:takePictureFail,
            selectTransactionLicense: selectTransactionLicense,
            scrollToTop: scrollToTop
        };
    }());
    
    return transactionsCreateViewModel;
}());
