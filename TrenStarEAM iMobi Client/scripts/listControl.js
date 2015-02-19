/**
 * ListControl view model
 */

var app = app || {};

app.ListControl = (function () {
    'use strict'

    // ListControl view model
    var listControl = (function () {
        var removeListViewWrapper = function(control) {
            var parentcontrol = control.parent();
            if (parentcontrol.hasClass('km-listview-wrapper')) {
                var grandParentcontrol = control.parent().parent();    
                parentcontrol.remove(); //am I still in memory???
                grandParentcontrol.append(control);    
            }
        };
        
        var applyDataTemplate = function(control, data, template) {
            var listView = control.kendoMobileListView({
                                                           dataSource: kendo.data.DataSource.create({data: data}),       
        
                                                           template: $(template).html(),
                                                           fixedHeaders: true,
                                                           scrollThreshold: 30, //threshold in pixels
                                                           endlessScroll: false
                                                       });   
        };
        
        return {
            removeListViewWrapper: removeListViewWrapper,
            applyDataTemplate: applyDataTemplate
            
        };
    }());
    
    return listControl;
}());
