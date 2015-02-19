/**
 * Contacts view model
 */

var app = app || {};

app.Contacts = (function () {
    'use strict'
    
    // Contacts model
    var contactsModel = (function () {
        var contactsDataSource = new kendo.data.DataSource({
                                                               data: [{ id: 1, name: 'Bob' }, { id: 2, name: 'Mary' }, { id: 3, name: 'John' }]
                                                           });
        
        return {
            contacts: contactsDataSource
        };
    }());

    // contacts view model
    var contactsViewModel = (function () {
        // Navigate to activityView When some activity is selected
        return {
            contacts: contactsModel.contacts
        };
    }());
    
    return contactsViewModel;
}());
