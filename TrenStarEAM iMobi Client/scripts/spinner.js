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

        withCallback: function () {
            if (!this.checkSimulator()) {
                window.plugins.spinnerDialog.show(
                    null,
                    null,
                    function(msg) {alert("Callback msg: " + msg)}
                );
            }
        },

        withMessage: function (message) {
            if (!this.checkSimulator()) {
                window.plugins.spinnerDialog.show(
                  null,
                  message,
                  null
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
            if (window.navigator.simulator === true) {
                return true;
            } else if (window.plugins.spinnerDialog === undefined) {
                return true;
            } else {
                return false;
            }
        }
    });

    app.spinnerService = {
        viewModel: new SpinnerViewModel()
    };
})(window);