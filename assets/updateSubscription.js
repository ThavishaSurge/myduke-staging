var updateSubscriptionWorkflow = document.getElementById("updateSubscriptionWorkflow");
var regularCartWorkflow = document.getElementById("regularCartWorkflow");
var updateSubscriptionList = document.getElementsByClassName("updateSubscription");
var regularCartList = document.getElementsByClassName("regularCart");

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('updateSubscription')) {
    updateSubscriptionWorkflow.style.display = "block";
    regularCartWorkflow.innerHTML = "";

    for (const element of updateSubscriptionList) {
        element.style.display = "inline-block";
    };
    for (const element of regularCartList) {
        element.style.display = "none";
    };

}

function cancelSubscription(e) {
    e.preventDefault();
    grpcModule.cancelSubscription().then(() => {
        window.location.reload();
    });
}