alertify.defaults.glossary.title = "PinPoint";

function showTwoButtonsDialog(message, buttonNames, callbacks) {
    if (!alertify.twoButtonsDialog) {
        alertify.dialog('twoButtonsDialog', function factory() {
            return {
                main: function(message, buttonNames, callbacks) {
                    this.message = message;
                    this.buttonNames = buttonNames;
                    this.callbacks = callbacks;
                },
                setup: function() {
                    return {
                        buttons: [{
                            text: "dummy"
                        }, {
                            text: "dummy"
                        }]
                    };
                },
                prepare: function() {
                    this.setContent(this.message);
    
                    var i;
                    for (i = 0; i < this.elements.buttons.primary.children.length; i++) {
                        var button = this.elements.buttons.primary.children[i];
                        button.innerHTML = this.buttonNames[i];
                    }
                },
                callback: function(closeEvent) {
                    var callback = this.callbacks[closeEvent.index];
                    if (callback) {
                        callback();
                    }
                }
            }
        });
    }

    alertify.twoButtonsDialog(message, buttonNames, callbacks);
}

function showOneButtonDialog(message, buttonName, callback) {
    if (!alertify.oneButtonDialog) {
        alertify.dialog('oneButtonDialog', function factory() {
            return {
                main: function(message, buttonName, callback) {
                    this.message = message;
                    this.buttonName = buttonName;
                    this.callback = callback;
                },
                setup: function() {
                    return {
                        buttons: [{
                            text: "dummy"
                        }]
                    };
                },
                prepare: function() {
                    this.setContent(this.message);
    
                    var button = this.elements.buttons.primary.children[0];
                    button.innerHTML = this.buttonName;
                },
                callback: function(closeEvent) {
                    if (this.callback) {
                        this.callback();
                    }
                }
            }
        });
    }

    alertify.oneButtonDialog(message, buttonName, callback);
}