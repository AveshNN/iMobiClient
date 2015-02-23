/**
 * Home view model
 */

var app = app || {};

app.Home = (function () {
    'use strict'

    var hiddenControlFirstName;
    var hiddenControlLastName;
    var hiddenControlDefaultProfile;
    var hiddenControlEmail;
    var hiddenControlDefaultTProfileId;
    
    var chart;
    
    // Home view model
    var homeViewModel = (function () {
        var show = function (e) {
            if (e.view.params.firstName != null) {
                hiddenControlFirstName = e.view.params.firstName;
                hiddenControlLastName = e.view.params.lastName;
                hiddenControlDefaultProfile = e.view.params.defaultProfile;
                hiddenControlEmail = e.view.params.emailAddress;
                hiddenControlDefaultTProfileId = e.view.params.defaultProfileId;
                console.log("homeshow");
                chartData();
            }
        };
        
        var chartData = function() {
            getEquipmentOnHand(hiddenControlDefaultTProfileId);
        };
        
        var getEquipmentOnHand = function(trackingProfileId) {           
            var data = "tprofileId=" + trackingProfileId + "&lastDays=10";
            
            app.Service.ajaxCall("GetOnsiteVolumesLastDays", data, "app.Home.setEquipmentOnHand", "Getting Inventory Data");
        };
        
        var randomColor = function() {
            var letters = '0123456789ABCDEF'.split('');
            var color = "#";
            for (var i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        };
        
        var setEquipmentOnHand = function(list) {
            var eq = [];
            var overAll;
            if (list != null) {	
                for (var i = 0;i < list.length;i++) {
                    var inv = list[i];
                    if (inv.Date != "-1") {
                        eq.push({ Onsite: inv.Onsite, Dispatch: inv.Dispatch,  Date: inv.Date, ColorO: "#009900", ColorD: "#FF0000"  });
                    }
                    else{
                        overAll = inv.Volume;
                    }
                }
            }
            
            var htmOverall = document.getElementById("overall");
            htmOverall.innerHTML = "Current Onsite - " + overAll;
            
            var chart = AmCharts.makeChart("chartdiv", {
               "theme": "none",
               "type": "serial",
               "dataProvider": eq,
               "valueAxes": [{
                           "axisAlpha": 0,
                           "position": "left"
                           }],
               "graphs": [{
                           "balloonText": "[[category]] Onsite:[[value]]",
                           "colorField": "ColorO",
                           "fillAlphas": 1,
                           "lineAlpha": 0,
                           "title": "Date",
                           "type": "column",
                           "valueField": "Onsite"
                       },
                		{
                			"balloonText": "[[category]] Dispatch:[[value]]",
                            "colorField": "ColorD",
                			"fillAlphas": 0.8,
                			"id": "AmGraph-2",
                			"lineAlpha": 0.2,
                			"title": "Dispatch",
                			"type": "column",
                			"valueField": "Dispatch"
                		}],
               "depth3D": 20,
               "angle": 40,
               "rotate": true,
               "categoryField": "Date",
               "categoryAxis": {
                                "gridPosition": "start",
                                "fillAlpha": 1.05,
                                "position": "right"
                               },
               "exportConfig":{
                    "menuTop":"20px",
                    "menuRight":"20px",
                    "menuItems": [{
                                    "format": 'png'	  
                                }]  
                }
                                           });
            jQuery('.chart-input').off().on('input change', function() {
                var property = jQuery(this).data('property');
                var target = chart;
                chart.startDuration = 0;

                if (property == 'topRadius') {
                    target = chart.graphs[0];
                    if (this.value == 0) {
                        this.value = undefined;
                    }
                }

                target[property] = this.value;
                chart.validateNow();
            });
           
            $('#chartdiv').find('a').each(function() {
                var myhref = $(this);
                myhref.context.outerHTML = "";
            });
        };
        
        var initial = function(fname, lname, dprofile, email, dtprofileId) {
            hiddenControlFirstName = fname;
            hiddenControlLastName = lname;
            hiddenControlDefaultProfile = dprofile;
            displayControlEmail = email;
            
            console.log("homeinit");
        };
        
        var userProfileFirstName = function() {
            return hiddenControlFirstName;
        };
        
        var userProfileLastName = function() {
            return hiddenControlLastName;
        };
        
        var userProfileEmail = function() {
            return hiddenControlEmail;
        };
        
        var userProfileDefaultTProfileId = function() {
            return hiddenControlDefaultTProfileId;
        };
        
        var userProfileDefaultTProfile = function() {
            return hiddenControlDefaultProfile;
        };
        
        return {
            init : initial,
            show : show,
            userProfileEmail: userProfileEmail,
            userProfileDefaultTProfileId: userProfileDefaultTProfileId,
            userProfileDefaultTProfile: userProfileDefaultTProfile,
            userProfileFirstName: userProfileFirstName,
            userProfileLastName: userProfileLastName,
            chartData: chartData,
            setEquipmentOnHand: setEquipmentOnHand,
            randomColor: randomColor
        };
    }());
    
    return homeViewModel;
}());
