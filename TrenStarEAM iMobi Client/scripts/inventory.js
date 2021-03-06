/**
 * Inventory view model
 */

var app = app || {};
var displayControlEmail;

app.Inventory = (function () {
    'use strict'

    var displayControl;
    var displayControlInventoryType;
    var displayControlInventoryProfile
    var inventoryType;
    var groupedData = [];
    
    // Inventory view model
    var inventoryViewModel = (function () {
        var initial = function(x, y, z) {
            displayControl = x;
            displayControlInventoryType = y;
            displayControlInventoryProfile = z;
        };
        
        var show = function (e) {
            var defaultTrackingProfile = app.User.userProfileDefaultTProfile();
            
            document.getElementById(displayControl).innerHTML = defaultTrackingProfile
            document.getElementById(displayControlInventoryType).innerHTML = defaultTrackingProfile;
            document.getElementById(displayControlInventoryProfile).innerHTML = defaultTrackingProfile;
        };
        
        var scrollToTop = function() {
            $(".km-scroll-container").css("-webkit-transform", "");
        }
        
        var navigateInventory = function(view, type) {
            app.Inventory.scrollToTop();
            
            groupedData = [];
            var trackingProfileId = app.User.userProfileDefaultTProfileId();
            inventoryType = type;
            
            if (type === "INBOUND") {
                document.getElementById("navbarInventory").innerHTML = "Inbound Inventory";
            }
            else {
                if (type === "OUTBOUND") {
                    document.getElementById("navbarInventory").innerHTML = "Outbound Inventory";
                }
                else {
                    if (type === "ONSITE") {
                        document.getElementById("navbarInventory").innerHTML = "Onsite Inventory";
                    }
                }
            }
            
            //document.location.href = view;
            app.mobileApp.navigate("#" + view);
            
            if (type !== "HOME") {
                getInventory(type, trackingProfileId);
            }
        };
        
        var navigateInventoryProfile = function(itemTypeId, itemType, type, count) {
            var trackingProfileId = app.User.userProfileDefaultTProfileId();
            
            document.getElementById("pType").innerHTML = type;
            document.getElementById("selectedItemType").innerHTML = itemType;
            document.getElementById("quantity").value = count;
            
            if (type === "Inbound Inventory") {
                type = "INBOUND";
                inventoryType = type;
                
                getInventoryProfile(type, trackingProfileId, itemTypeId);
                //document.location.href = "#view-inventory-profiles";
                app.mobileApp.navigate("#view-inventory-profiles");
            }
			
            if (type === "Outbound Inventory") {
                type = "OUTBOUND";
                inventoryType = type;
                
                getInventoryProfile(type, trackingProfileId, itemTypeId);
                //document.location.href = "#view-inventory-profiles";
                app.mobileApp.navigate("#view-inventory-profiles");
            }
            
            if (type === "Onsite Inventory") {
                type = "ONSITE";
                inventoryType = type;
            }
        };
        
        var getInventory = function(type, trackingProfileId) {           
            var skip = 0;
            var data = "type=" + type + "&tprofileId=" + trackingProfileId + "&skip=" + skip;
            
            app.Service.ajaxCall("GetInventoryItemTypes", data, "app.Inventory.setInventory", "Loading Inventory");
        };
        
        var getInventoryMore = function(type, trackingProfileId, skip) {
            var data = "type=" + type + "&tprofileId=" + trackingProfileId + "&skip=" + skip;
            
            app.Service.ajaxCall("GetInventoryItemTypes", data, "app.Inventory.setInventory", "Loading Inventory");
        };
        
        var getInventoryProfile = function(type, trackingProfileId, itemTypeId) {
            var data = "type=" + type + "&tprofileId=" + trackingProfileId + "&itemTypeId=" + itemTypeId;
            
            app.Service.ajaxCall("GetInventoryProfileItemTypes", data, "app.Inventory.setInventoryProfile", "Loading Inventory");
        };
        
        var loadMore = function() {
            var trackingProfileId = app.User.userProfileDefaultTProfileId();
            getInventoryMore(inventoryType, trackingProfileId, groupedData.length);
        };
        
        var setInventoryProfile = function(list) {
            var groupedDataProfileItemTypes = [];
    
            for (var i = 0;i < list.length;i++) {
                var inv = list[i];
                groupedDataProfileItemTypes.push({ TProfileId: inv.TProfileId, TProfile: inv.TProfile, Count: inv.Count, Type: inv.Type });
            }
            
            var profileItemTypes = $("#grouped-listviewsInventoryProfiles");
            app.ListControl.removeListViewWrapper(profileItemTypes);

            app.ListControl.applyDataTemplate(profileItemTypes, groupedDataProfileItemTypes, "#customListViewInventoryProfileItemTypes");
        };
        
        var setInventory = function(list) {
            var type = null;
            var sumOfItems = 0;
           
            if (list != null) {	
                for (var i = 0;i < list.length;i++) {
                    var inv = list[i];
                    type = inv.Type;
                    groupedData.push({ ItemType: inv.ItemType, ItemTypeId: inv.ItemTypeId, Count: inv.Count, Type: inv.Type });
            
                    sumOfItems = inv.TotalCount;
                }
    
                app.consoleLog("type:" + type);
                
                var newSum = 0;
                if (type !== null) {
                    if (type == "Onsite Volumes Inventory") {
                        var OnsiteVolume = $("#grouped-listviewsvolumetypesareaonsite");
                        app.ListControl.removeListViewWrapper(OnsiteVolume);
            
                        app.ListControl.applyDataTemplate(OnsiteVolume, groupedData, "#customListViewInventoryItemTypesOnsite");
        
                        document.getElementById('sumOfItems').value = sumOfItems;
                    }
                    else {
                        var retInventory = $("#grouped-listviewsInventory");            
                        app.ListControl.removeListViewWrapper(retInventory);
            
                        app.ListControl.applyDataTemplate(retInventory, groupedData, "#customListViewInventoryItemTypes");
           
                        document.getElementById('sumOfItems').value = sumOfItems;
                    }
                }
            }
        };
        
        return {
            init : initial,
            show : show,
            navigateInventory: navigateInventory,
            navigateInventoryProfile: navigateInventoryProfile,
            getInventory: getInventory,
            setInventory:setInventory,
            loadMore: loadMore,
            getInventoryMore: getInventoryMore,
            setInventoryProfile: setInventoryProfile,
            scrollToTop: scrollToTop
        };
    }());
    
    return inventoryViewModel;
}());
