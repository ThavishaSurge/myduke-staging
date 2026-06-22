var subscriptionStatusEnum = grpcModule.grpcEnum.subscriptionStatusEnum;
var lineItemString = sessionStorage.getItem("lineItems");

if(lineItemString === null) {

    /*grpcModule.getSubscription().then((res) => {
        if (res.subscriptionDetails.status === subscriptionStatusEnum.SUBSCRIPTION_ACTIVE || res.subscriptionDetails.status === subscriptionStatusEnum.SUBSCRIPTION_PAYMENT_UNSUCCESSFUL) {
            var dueDate = new Date(res.subscriptionDetails.dueDate.seconds * 1000).toDateString();
            sessionStorage.setItem('subscriptionDueDate', dueDate);
        } else {
            sessionStorage.setItem('subscriptionSchedule',"1");
        }
        sessionStorage.setItem('subscriptionStatus', String(res.subscriptionDetails.status));
        var subtotal = 0;
        var lineItems = [];
        console.log(res);
        for (var item of res.subscriptionOrder.lineItems) {
            if (item.title.value != "Empty Subscription Item") {
                lineItems.push(item);
            } 
            else if (item.title.value == "Empty Subscription Item" && res.subscriptionOrder.lineItems.length == 1) {
                sessionStorage.setItem('new_subscription', true); 
            }
            subtotal += item.price.value * item.quantity.value;
        }
        sessionStorage.setItem('lineItems', JSON.stringify(lineItems));    
        subtotal = subtotal.toFixed(2)
        sessionStorage.setItem('subscriptionSchedule',res.subscriptionDetails.schedule == 0 ? "1" : res.subscriptionDetails.schedule);
        sessionStorage.setItem('subtotal',subtotal)

    }).catch((err) => {
        console.log(err)
    });*/
}