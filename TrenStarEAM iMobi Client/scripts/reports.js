/**
 * Reports view model
 */

var app = app || {};

app.Reports = (function () {
    'use strict'

    // Reports view model
    var reportsViewModel = (function () {
        
        var show = function () {
           
            getReports();
        };
        
        var getReports = function(x) {
           setReports(null);
        };
        
        var setReports = function(list) {
            var groupedDataReports = [];
            
            if (list != null) {
                for (var i = 0;i < list.length;i++) {
                    var report = list[i];
                
                    groupedDataReports.push({ Report: report.Report, ReportId: report.ReportId });    
                }
            }
            
            if (groupedDataReports.length == 0) {
                groupedDataReports.push({ Report: "Company Equipment Status", ReportId: -1 });       
                groupedDataReports.push({ Report: "Stock On Hand", ReportId: -2 });       
            }
            
            var control = $("#grouped-listviewsReports");            
            app.ListControl.removeListViewWrapper(control);
        
            app.ListControl.applyDataTemplate(control, groupedDataReports, "#customListViewTemplateReports");
        };
        
        var request = function(report){
            app.Alert.openAlertWindow("Report", report + " unavailable" );
        };
        
        return {
            show: show,
            getReports: getReports,
            setReports: setReports,
            request: request
        };
    }());
    
    return reportsViewModel;
}());
