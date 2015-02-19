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
            
            app.Service.ajaxCall("GetOnsiteVolumesLastDays", data, "app.Home.setEquipmentOnHand");
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
            if (list != null) {	
                for (var i = 0;i < list.length;i++) {
                    var inv = list[i];
                    //eq.push({ y: inv.Count, label: inv.Count, indexLabel: inv.ItemType });
                    eq.push({ Count: inv.Count, Date: inv.Date, Color: randomColor() });
                }
            }
            
            var chart = AmCharts.makeChart("chartdiv", {
               "theme": "none",
               "type": "serial",
               "dataProvider": eq,
               "valueAxes": [{
                           "axisAlpha": 0,
                           "position": "left"
                           }],
               "graphs": [{
                           "balloonText": "[[category]]:[[value]]",
                           "colorField": "Color",
                           "fillAlphas": 1,
                           "lineAlpha": 0,
                           "title": "Date",
                           "type": "column",
                           "valueField": "Count"
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
