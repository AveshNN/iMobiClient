(function (global) {
    var SpinnerViewModel,
        app = global.app = global.app || {};

    SpinnerViewModel = kendo.data.ObservableObject.extend({

        spinnerOnly: function () {
            if (!this.checkSimulator()) {
                window.plugins.spinnerDialog.show();
            }
        },
        
        spinnerStop: function () {
            if (!this.checkSimulator()) {
                window.plugins.spinnerDialog.hide();
            }
        },

        withMessageCallback: function (message) {
            if (!this.checkSimulator()) {
                window.plugins.spinnerDialog.show(
                    null,
                    message,
                    function() {app.Service.abortAjaxCall()}
                );
            }
        },

        withMessage: function (message) {
            
            if (!this.checkSimulator()) {
                
                window.plugins.spinnerDialog.show(
                  null,
                  message,
                  true
                );
                
            }
        },

        withTitle: function () {
            if (!this.checkSimulator()) {
                window.plugins.spinnerDialog.show(
                  "I'm the spinner title",
                  null,
                  null
                );
            }
        },

        withMessageAndTitle: function () {
            if (!this.checkSimulator()) {
                window.plugins.spinnerDialog.show(
                  "Spinning like crazy",
                  "Loading some awesome stuff",
                  null
                );
            }
        },

        fixedSpinner: function () {
            if (!this.checkSimulator()) {
                window.plugins.spinnerDialog.show(
                  "I'm a fixed spinner",
                  "I will spin for 5 seconds",
                  true
                );
                setTimeout(function() {
                    window.plugins.spinnerDialog.hide();
                }, 5000);
            }
        },

        checkSimulator: function() {
            var isSimulator = app.deviceInfo.deviceIsSimulator();
            if (isSimulator === false){
                if (window.plugins.spinnerDialog === undefined){
                    isSimulator = true;
                }
                else{
                    isSimulator = false;
                }
            }
            
            return isSimulator;
        }
    });

    app.spinnerService = {
        viewModel: new SpinnerViewModel()
    };
})(window);