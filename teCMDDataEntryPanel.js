"use strict";

function getCurrentJobValues() {
    return new Promise(function(resolve, reject) {
        parent.postMessage("fetch_job_meta_data", document.referrer);
        window.addEventListener("message", function el(e) {
            if (e.data && typeof e.data !== "string" && e.data.eventType === 'init') {
                currentJobValues = JSON.parse(JSON.stringify(e.data));
                window.removeEventListener("message", el, false);
            }
            resolve();
        });
    });
};


function getFormValues() {
    var retVal = Number(document.getElementById("display").value);
    return retVal;
};

/**
 * A handler function to prevent default submission and run our custom script.
 * @param  {Event} event  the submit event triggered by the user
 * @return {void}
 */
var handleFormSubmit = function handleFormSubmit(event) {
    // Stop the form from submitting since we’re handling that with AJAX.
    event.preventDefault();
    getCurrentJobValues().then(function() {
        var data = null;
        if (cancel) {
            var oldValue = currentJobValues.metadata.MyCustomDataEntryPanelField[0];
            if (!isNaN(currentJobValues.metadata.MyCustomDataEntryPanelField[0])) {
                data = Number(currentJobValues.metadata.MyCustomDataEntryPanelField[0]);
            } else {
                data = 0;
            }
        } else {
            // Call our function to get the form data.
            data = getFormValues();
        }
        if (document.referrer) {
            parent.postMessage(data, document.referrer);
        }
    });
}


var handleCancel = function handleCancel(event) {
    cancel = true;
};

/*
 * This is where things actually get started. We find the form element using
 * its class name, then attach the `handleFormSubmit()` function to the
 * `submit` event.
 */
var cancel = false;
var currentJobValues = null;
var form = document.getElementById("theForm");
form.addEventListener("submit", handleFormSubmit);
form.addEventListener("cancel", handleCancel);
