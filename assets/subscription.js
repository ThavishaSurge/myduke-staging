var subscriptionLoadingList = document.getElementsByClassName("subscriptionLoading");
var subscriptionInactiveList = document.getElementsByClassName("subscriptionInactive");
var subscriptionActiveList = document.getElementsByClassName("subscriptionActive");
var monthlySubscriptionList = document.getElementsByClassName("monthlySubscription");
var quarterlySubscriptionList = document.getElementsByClassName("quarterlySubscription");
var subscriptionDueDate = document.getElementById("subscriptionDueDate");
var subscriptionDueDateContainer = document.getElementById("subscriptionDueDateContainer");
var subscriptionCart = document.getElementById("subscriptionCart");
var numSubscriptionItems = document.getElementById("numSubscriptionItems");
var subscriptionSubTotal = document.getElementById("subscriptionSubTotal");
var subscriptionDiscount = document.getElementById("subscriptionDiscount");
var subscriptionTotal = document.getElementById("subscriptionTotal");
var invalidSubscriptionTotal = document.getElementById("invalidSubscriptionTotal");
var continueButton = document.getElementById("continueButton");
var saveSubscriptionButton = document.getElementById("saveSubscriptionButton");
var resetSubscriptionInSessionStorageButton = document.getElementById("resetSubscriptionInSessionStorageButton");
var newSubscriptionDescription = document.getElementById("newSubscriptionDescription");
var saveSubscriptionErrorText = document.getElementById("saveSubscriptionErrorText");
var saveSubscriptionSuccessText = document.getElementById("saveSubscriptionSuccessText");
var changeSubscriptionScheduleSelect = document.getElementById("changeSubscriptionScheduleSelect");
var cartCount = document.querySelector("[data-cart-count]").innerText;
var lineItemString = sessionStorage.getItem("lineItems");
var subscriptionStatusEnum = grpcModule.grpcEnum.subscriptionStatusEnum;
var userId = getUserId();
var prescribedNicotineAmount;
var proceedWithExcessNicotine = false;

async function getProductUpgradeStat(existingProductId, updatedProductId) {
  console.log('access');
    /*var useremail  getEmail();
    if(useremail == "annatest+2@gmail.com"){
      const userId = "6829251723354";
    }else{
      const userId = getUserId();
    }*/
  const userId = getUserId();
  console.log(userId);
  
  //   var tokenPayload = tokenPayload();
  // console.log(tokenPayload);
    //const userId = "6829251723354";
  //console.log('jaydip userId ',userId);
  //console.log('jaydip existingProductId ',existingProductId);
  //console.log('jaydip updatedProductId ',updatedProductId);
    await grpcModule.getProductUpgradeStat(userId, existingProductId, updatedProductId).then((res) => {
      //console.log('jaydip pass ',res);
        customerUpgrade = res.status;
    }).catch((e) => {
      //console.log('jaydip error ',e);
        customerUpgrade = false;
    });
  additemorremove(customerUpgrade)
  
}
function additemorremove(itemstatus){
  console.log('api customer status', itemstatus);
  console.log('alreadyadded ', ProductUpgradeStatdata.alreadyadded);
  if(itemstatus == 'YY'){
    //$('.discontinued.bannercopy').show();
  }
  if((itemstatus != 'YY' && ProductUpgradeStatdata.alreadyadded == true) || (ProductUpgradeStatdata.removefreeitem == true)){
    //remove the free item from cart
    console.log('remove the free item from cart');
    $.ajax({
        type: 'POST',
        url: '/cart/change.js',
        dataType: 'json',
        data: {
          'id': parseFloat(ProductUpgradeStatdata.freeitemvariantid),
          'quantity': 0
        }
     }).then(data => {
       location.reload();
     })
  } else if(itemstatus == 'YY' && ProductUpgradeStatdata.alreadyadded == false){
    // add free item in cart
    console.log('add free item in cart');
    $.ajax({
      type: 'POST',
      url: '/cart/add.js',
      data: {id:ProductUpgradeStatdata.freeitemvariantid, quantity:1},
      dataType: 'json',
      success: function() {
        location.reload();
      },
      error: function() {
        
      }
    });
  }
}

    if(lineItemString === null) {
        saveSubscriptionButton.style.display = "none";
        for (const element of subscriptionLoadingList) {
            element.style.display = "none"
        };
        /*grpcModule.getSubscription().then((res) => {
            for (const element of subscriptionLoadingList) {
                element.style.display = "none"
            };

            if (res.subscriptionDetails.status === subscriptionStatusEnum.SUBSCRIPTION_ACTIVE || res.subscriptionDetails.status === subscriptionStatusEnum.SUBSCRIPTION_PAYMENT_UNSUCCESSFUL) {
                for (const element of subscriptionInactiveList) {
                    element.style.display = "none"
                };
                for (const element of subscriptionActiveList) {
                    element.style.display = "inline-block";
                };
                var dueDate = new Date(res.subscriptionDetails.dueDate.seconds * 1000).toDateString();
                subscriptionDueDate.innerText = dueDate;
                sessionStorage.setItem('subscriptionDueDate', dueDate);
                updateshippingrateswhensub();
            } else {
                for (const element of subscriptionInactiveList) {
                    element.style.display = "inline-block"
                };
                for (const element of subscriptionActiveList) {
                    element.style.display = "none";
                };
                sessionStorage.setItem('subscriptionSchedule',"1");
            }
            sessionStorage.setItem('subscriptionStatus', String(res.subscriptionDetails.status));
            numSubscriptionItems.innerText = res.subscriptionOrder.lineItems.length;
            var subtotal = 0;
        
            var lineItems = [];
            for (var item of res.subscriptionOrder.lineItems) {
                if (item.title.value != "Empty Subscription Item") {
                    lineItems.push(item);
                    subscriptionCart.appendChild(createSubscriptionLineItemHTML(item));
                } else if (item.title.value == "Empty Subscription Item" && res.subscriptionOrder.lineItems.length == 1) {
                    for (const element of subscriptionInactiveList) {
                        element.style.display = "inline-block";
                    };
                    for (const element of subscriptionActiveList) {
                        element.style.display = "none";
                    };

                    if (saveSubscriptionButton) {
                        saveSubscriptionButton.style.display = "none";
                    }

                    sessionStorage.setItem('new_subscription', true);   
                }
                subtotal += item.price.value * item.quantity.value;
            }
        
            sessionStorage.setItem('lineItems', JSON.stringify(lineItems));    
            subtotal = subtotal.toFixed(2)
            var discount = (subtotal * 0.1).toFixed(2);
            var total = (subtotal * 0.9).toFixed(2);
        
            subscriptionSubTotal.innerText = subtotal;
            subscriptionDiscount.innerText = discount;
            subscriptionTotal.innerText = total;
            
            sessionStorage.setItem('subscriptionSchedule',res.subscriptionDetails.schedule == 0 ? "1" : res.subscriptionDetails.schedule);
            checkMonthlyOrQuarterly(res.subscriptionDetails.schedule);
            
            var itemData = sessionStorage.getItem('lineItems')
            var items = JSON.parse(itemData)
            if (items.length > 0 || cartCount == '0')
            {
                checkValidSubscription(subtotal);
            }
            sessionStorage.setItem('subtotal',subtotal)
            window.location.reload();
           
        
        }).catch((err) => {
            console.log(err);
            for (const element of subscriptionInactiveList) {
                element.style.display = "inline-block";
            };

            sessionStorage.setItem('subscriptionSchedule',"1")
            for (const element of subscriptionActiveList) {
                element.style.display = "none";
            };
        })*/
    }
    else {
        
        checkMonthlyOrQuarterly(sessionStorage.getItem('subscriptionSchedule'))
        var subtotal = 0;
        var lineItems = JSON.parse(lineItemString);
        for (const element of subscriptionLoadingList) {
            element.style.display = "none"
        };
        if (sessionStorage.getItem("subscriptionStatus") === subscriptionStatusEnum.SUBSCRIPTION_ACTIVE.toString() || sessionStorage.getItem("subscriptionStatus") === subscriptionStatusEnum.SUBSCRIPTION_PAYMENT_UNSUCCESSFUL.toString()) {
            for (const element of subscriptionInactiveList) {
                element.style.display = "none"
            };
            for (const element of subscriptionActiveList) {
                element.style.display = "inline-block"
            };
            
        } else {
            if (saveSubscriptionButton) {
                saveSubscriptionButton.style.display = "none";
            }

            if (lineItems.length !== 0) {
                for (const element of subscriptionInactiveList) {
                    element.style.display = "none"
                };
                for (const element of subscriptionActiveList) {
                    element.style.display = "inline-block"
                };
                subscriptionDueDateContainer.style.display = "none";
            } else {
                for (const element of subscriptionInactiveList) {
                    element.style.display = "inline-block"
                };
                for (const element of subscriptionActiveList) {
                    element.style.display = "none"
                };
            }
            
        }

        if (userId && (lineItems.filter(i => i.title.value === "Empty Subscription Item").length !== 0)) {
            if (saveSubscriptionButton) {
                saveSubscriptionButton.disabled = true;
            }
            if (saveSubscriptionErrorText) {
                saveSubscriptionErrorText.innerText = "A subscription must contain at least one item.";
            }
        } else {
            if (saveSubscriptionButton) {
                saveSubscriptionButton.disabled = false;
            }
            if (saveSubscriptionErrorText) {
                saveSubscriptionErrorText.innerText = "";
            }
        }

        for (var item of lineItems) {
            if (item.title.value != "Empty Subscription Item") {
                subscriptionCart.appendChild(createSubscriptionLineItemHTML(item));
                subtotal += parseInt(item.price.value) * parseInt(item.quantity.value);
            }
        }
        subtotal = subtotal.toFixed(2)
        var discount = subtotal >= 100 ? (subtotal * 0.1).toFixed(2) : 0;
        var total = subtotal >= 100 ? (subtotal * 0.9).toFixed(2) : subtotal;

        subscriptionSubTotal.innerText = subtotal;
        subscriptionDiscount.innerText = discount;
        subscriptionTotal.innerText = total;

        var itemData = sessionStorage.getItem('lineItems')
        var items = JSON.parse(itemData)
        if (items.length > 0 || cartCount == '0')
        {
            checkValidSubscription(subtotal);
        }
        if (items.length > 0){
          updateshippingrateswhensub();
        }

        var total_nicotine = 0

        items.map((item) => {
            let itemNicotine = item.properties.find(o => o.name === '_total_nicotine');
            if (itemNicotine){
                total_nicotine += itemNicotine.value * item.quantity.value;
            }
        })

        /*var expressshippingamount = document.getElementsByClassName("expressshippingamount");
        for (const element of expressshippingamount) {
            element.textContent = "Free"
        };
        var todaysproductsamount = document.getElementsByClassName("todaysproductsamount");
        for (const element of todaysproductsamount) {
          var todaysproductsamountprice = element.innerText;
          var todaystotal = document.getElementsByClassName("todaystotal");
          for (const element of todaystotal) {
              element.textContent = todaysproductsamountprice
          };
        }*/
      
        sessionStorage.setItem('total_nicotine', total_nicotine);
        numSubscriptionItems.innerText = lineItems.length;
        subscriptionDueDate.innerText = sessionStorage.getItem('subscriptionDueDate');
        sessionStorage.setItem('subtotal',subtotal)
        sessionStorage.setItem('discount',discount)
        // sessionStorage.setItem('total',total)
    }

    if (userId && (sessionStorage.getItem("subscriptionStatus") === subscriptionStatusEnum.SUBSCRIPTION_ACTIVE.toString() || sessionStorage.getItem("subscriptionStatus") === subscriptionStatusEnum.SUBSCRIPTION_PAYMENT_UNSUCCESSFUL.toString())) {
    saveSubscriptionButton.style.display = "flex";
    resetSubscriptionInSessionStorageButton.innerText = "Revert";
} else if (userId && (sessionStorage.getItem("subscriptionStatus") !== subscriptionStatusEnum.SUBSCRIPTION_ACTIVE.toString() && sessionStorage.getItem("subscriptionStatus") !== subscriptionStatusEnum.SUBSCRIPTION_PAYMENT_UNSUCCESSFUL.toString()) && sessionStorage.getItem("lineItems") !== null && sessionStorage.getItem("lineItems") !== "[]") {
    saveSubscriptionButton.style.display = "none";
    newSubscriptionDescription.style.display = "inline-block";
    resetSubscriptionInSessionStorageButton.innerText = "Clear"
} else if (userId && (sessionStorage.getItem("subscriptionStatus") !== subscriptionStatusEnum.SUBSCRIPTION_ACTIVE.toString() && sessionStorage.getItem("subscriptionStatus") !== subscriptionStatusEnum.SUBSCRIPTION_PAYMENT_UNSUCCESSFUL.toString()) && (sessionStorage.getItem("lineItems") === null || sessionStorage.getItem("lineItems") == "[]")) {
    saveSubscriptionButton.style.display = "none";
    newSubscriptionDescription.style.display = "none";
    resetSubscriptionInSessionStorageButton.style.display = "none"
} else if (!userId && sessionStorage.getItem("lineItems") !== null) {
    saveSubscriptionButton.style.display = "none";
    newSubscriptionDescription.style.display = "inline-block";
    resetSubscriptionInSessionStorageButton.innerText = "Clear";
} else if (!userId && sessionStorage.getItem("lineItems") === null) {
    saveSubscriptionButton.style.display = "none";
    resetSubscriptionInSessionStorageButton.style.display = "none";
} else {
    saveSubscriptionButton.style.display = "none";
    newSubscriptionDescription.style.display = "none";
}

session_nicotine = parseInt(sessionStorage.getItem("total_nicotine"))
newSubscription = sessionStorage.getItem("new_subscription");

// Disable next button to proceed to checkout if no cart or subscription items
// If a user doesn't have an active subscription or anything added to their subscription and no items in cart
if (userId && (sessionStorage.getItem("subscriptionStatus") !== subscriptionStatusEnum.SUBSCRIPTION_ACTIVE.toString() && sessionStorage.getItem("subscriptionStatus") !== subscriptionStatusEnum.SUBSCRIPTION_PAYMENT_UNSUCCESSFUL.toString()) && sessionStorage.getItem("lineItems") === null && cartCount == "0") {
    if (continueButton) {
        continueButton.disabled = true;
    }
else if (userId && newSubscription && prescribedNicotineAmount && (session_nicotine > prescribedNicotineAmount)) {
    if (continueButton) {
        continueButton.disabled = true;
    }
}
} else if (!userId && sessionStorage.getItem("lineItems") === null && cartCount == "0") {
    if (continueButton) {
        continueButton.disabled = true;
    }
} else if (userId && (sessionStorage.getItem("subscriptionStatus") === subscriptionStatusEnum.SUBSCRIPTION_ACTIVE.toString() || sessionStorage.getItem("subscriptionStatus") === subscriptionStatusEnum.SUBSCRIPTION_PAYMENT_UNSUCCESSFUL.toString()) && cartCount == "0") {
    if (continueButton) {
        continueButton.disabled = true;
    }
}

getPrescribedNicotine().then((res) =>{
    if (userId && newSubscription && prescribedNicotineAmount && (session_nicotine > prescribedNicotineAmount)) {
        if (continueButton) {
            continueButton.disabled = true;
        }
        saveSubscriptionErrorText.innerText = "Your subscription exceeds your prescribed nicotine amount ("+ prescribedNicotineAmount+ " mg). Please reduce the nicotine content in your subscription in order to proceed to checkout.";
}});


function addItemToSubscription(cartIndex) {
document.getElementById(`item${cartIndex}Checkbox`).style.opacity = 1;
jQuery.getJSON('/cart.js').then((response) => {
    var lineItem = response.items[cartIndex - 1];
    var mappedLineItem = mapLineItemToDTO(lineItem);
    grpcModule.addLineItemToSubscription(mappedLineItem).then(res => {
        jQuery.ajax({
        url:'/cart/change.js',
        type: 'post',
        dataType: 'json',
        data: { quantity: 0, line: cartIndex },
        success: function(response) {
            window.location.reload();
        }
        });
    }).catch((err) => {
        console.log(err);
    })
    })   
}
function updateshippingrateswhensub() {
    var expressshippingamount = document.getElementsByClassName("expressshippingamount");
    for (const element of expressshippingamount) {
        element.textContent = "Free"
    };
    var todaysproductsamount = document.getElementsByClassName("todaysproductsamount");
    for (const element of todaysproductsamount) {
      var todaysproductsamountprice = element.innerText;
      var todaystotal = document.getElementsByClassName("todaystotal");
      for (const element of todaystotal) {
          element.textContent = todaysproductsamountprice
      };
    }
}
function checkValidSubscription(subtotal)
{
    var schedule = sessionStorage.getItem('subscriptionSchedule')
    if (!schedule || (schedule == 0 && subtotal < 100) || (schedule == 1 && subtotal < 100) || (schedule == 2 && subtotal < 300)) {
        invalidSubscriptionTotal.style.display = "block";
        invalidSubscriptionTotal.style.visibility = "visible";
        invalidSubscriptionTotal.style.marginTop = "-1.75rem";
        invalidSubscriptionTotal.style.marginBottom = "2rem";
        if (continueButton) {
            continueButton.disabled = true;
        }
        if (saveSubscriptionButton) {
            saveSubscriptionButton.disabled = true;
        }
        sessionStorage.setItem('validSubscription',"false")
    } else {
        invalidSubscriptionTotal.style.display = "none";
        sessionStorage.setItem('validSubscription',"true")
        if (saveSubscriptionButton) {
            saveSubscriptionButton.disabled = false;
        }
    }
}


function changeLineItemQuantityInSubscription(jsonLineItem, newQuantity) {
var parsedLineItem = JSON.parse(jsonLineItem);
grpcModule.changeLineItemQuantityInSubscription(parsedLineItem, newQuantity).then(res => {
    window.location.reload();
}).catch((err) => {
    console.log(err);
});  
}

function checkMonthlyOrQuarterly(scheduleValue){
    if (scheduleValue == 0 || scheduleValue == 1) {
        // Monthly subscription
        for (const element of monthlySubscriptionList) {
        element.style.display = "inline-block"
        };
        for (const element of quarterlySubscriptionList) {
        element.style.display = "none";
        };
        changeSubscriptionScheduleSelect.value = "Monthly";
    } else if (scheduleValue == 2) {
        // Quarterly subscription
        for (const element of monthlySubscriptionList) {
        element.style.display = "none"
        };
        for (const element of quarterlySubscriptionList) {
        element.style.display = "inline-block";
        };
        changeSubscriptionScheduleSelect.value = "Quarterly";
    }
}


function changeSubscriptionSchedule(stringifiedSchedule) {

var newSchedule = '0';
if (stringifiedSchedule == "Monthly") {
    newSchedule = '1';
  } else if (stringifiedSchedule == "Quarterly") {
    newSchedule = '2';
  }

    sessionStorage.setItem('subscriptionSchedule',newSchedule);

    window.location.reload();
}

function removeItemFromSubscription(jsonLineItem) {
var parsedLineItem = JSON.parse(jsonLineItem);
grpcModule.removeLineItemFromSubscription(parsedLineItem).then(res => {
    window.location.reload();
}).catch((err) => {
    console.log(err);
});   
}

function addItemToSessionStore(cartIndex) {
    document.getElementById(`item${cartIndex}Checkbox`).style.opacity = 1;
jQuery.getJSON('/cart.js').then((response) => {
    var lineItem = response.items[cartIndex - 1];
    lineItem.price = lineItem.price/100;
    lineItem.original_price = lineItem.original_price/100;
    lineItem.discounted_price = lineItem.discounted_price/100;
    lineItem.line_price = lineItem.line_price/100;
    lineItem.original_line_price = lineItem.original_line_price/100;
    lineItem.final_price = lineItem.final_price/100;
    lineItem.final_line_price = lineItem.final_line_price/100;
    
    // copy the properties into a format grpc expects
    properties = []
    for (var i in lineItem.properties){
        var obj = { "name" : i,
            "value" : lineItem.properties[i]
        };
        properties.push(obj);
    }
    lineItem.properties = properties;

    let currentData = sessionStorage.getItem('lineItems');
    if (currentData !== null){
        var lineItems = JSON.parse(currentData);
        var nextItem = mapLineItemToDTO(lineItem)
        lineItems.push(nextItem)
        sessionStorage.setItem('lineItems', JSON.stringify(lineItems));
    }
    else {
        var lineItems = []
        var nextItem = mapLineItemToDTO(lineItem)
        lineItems.push(nextItem)
        sessionStorage.setItem('lineItems', JSON.stringify(lineItems));
    }
    jQuery.ajax({
        url:'/cart/change.js',
        type: 'post',
        dataType: 'json',
        data: { quantity: 0, line: cartIndex },
        success: function(response) {
            window.location.reload();
        }
        });
    }).catch((err) => {
        console.log(err);
    })
}

function changeLineItemQuantityInSessionStorage(lineItemId, newQuantity) {
    var parsedLineItemId = parseInt(lineItemId);
    if (newQuantity == 0)
    {
        removeItemFromSessionStorage(lineItemId);
    }
    else {

        var items = JSON.parse(sessionStorage.getItem('lineItems'));
        for (var item of items){
            if (parsedLineItemId == item.id.value)
            {
                item.quantity.value = newQuantity;
            }
        }
        sessionStorage.setItem('lineItems', JSON.stringify(items));
        window.location.reload();  
    }
    }

function removeItemFromSessionStorage(lineItemId) {
    var items = JSON.parse(sessionStorage.getItem('lineItems'));
    items = items.filter(c => c.id.value !== parseInt(lineItemId));
    if (items.length == 0) {
        items.push(
            {
                title: {value: "Empty Subscription Item"},
                price: {value: 0},
                quantity: {value: 1},
            }
        )
    }

    sessionStorage.setItem('lineItems', JSON.stringify(items));
    window.location.reload();
}

function display(){
    console.log('hello');
}

async function addSubscriptionData() {
    //var form = document.forms.namedItem("cart-form");
    var form = document.getElementById("cart");
    var input = document.createElement("input");
    createFinalSubscriptionInSessionStorage();
    var subscriptionItems = JSON.parse(sessionStorage.getItem("finalSubscription"));
    var total_nicotine = 0;
    if (subscriptionItems !== null) {
        subscriptionItems["items"].map((item) => {
            let itemNicotine = item.properties.find(o => o.name === '_total_nicotine');
            if (itemNicotine){
                // need to use item.quantity here directly because we get it from session storage. 
                total_nicotine += itemNicotine.value * item.quantity;
            }
          })
          subscriptionItems.total_nicotine = total_nicotine;

          input.type = "text";
          input.name = "subscription";
          input.value = JSON.stringify(subscriptionItems);
          form.appendChild(input);
    }
    form.submit();
  }

async function resetSubscriptionInSessionStorage() {
    sessionStorage.clear();
    window.location.reload();
}

async function getPrescribedNicotine() {
    await grpcModule.getCurrentPrescription(userId).then((res) => {
        prescribedNicotineAmount = res.result.script.scriptIngredients[0].dose;
    }).catch(() => {
        prescribedNicotineAmount = 0;
    })
}

async function saveSubscriptionInDuke() {
    var items = JSON.parse(sessionStorage.getItem('lineItems'));
    saveSubscriptionButton.disabled = true;
    saveSubscriptionButton.innerText = "Saving...";
    const userId = getUserId();
    
    if (items !== null && items.filter(i => i.title.value == "Empty Subscription Item").length == 0) {
        const finalSubscription = {
            items: items,
            status: sessionStorage.getItem("subscriptionStatus"),
            schedule: sessionStorage.getItem('subscriptionSchedule'),
            subtotal: sessionStorage.getItem('subtotal'),
            validSubscription:sessionStorage.getItem('validSubscription'),
        }
        
        if (userId) {
            var total_nicotine = 0;
            if (items !== null) {
                items.map((item) => {
                    let itemNicotine = item.properties.find(o => o.name === '_total_nicotine');
                    if (itemNicotine){
                        total_nicotine += itemNicotine.value * item.quantity.value;
                    }
                })
            }

            if (total_nicotine > prescribedNicotineAmount){
                document.querySelector("#excess-nicotine-popup-enter").addEventListener('click', function () {
                    updateSubscription(finalSubscription, total_nicotine);
                    document.querySelector("#excess-nicotine-popup").style.display = 'none';
                  }, false);
                document.querySelector("#excess-nicotine-popup").style.display = 'block';
            }
            else{
                updateSubscription(finalSubscription, total_nicotine);
            }
        
        } else {
            saveSubscriptionErrorText.innerText = "Unable to save - no user could be found in the system";
        }
    } else {
        saveSubscriptionErrorText.innerText = "Unable to save - no items to save";
    }
}

async function updateSubscription(finalSubscription, total_nicotine) {
    const subscriptionDetails = {
        status: parseInt(finalSubscription.status),
        schedule: parseInt(finalSubscription.schedule),
        customerId: userId,
        nicotineAmountInMg: total_nicotine,
    }
    try {
        var res = await grpcModule.addSubscription({subscriptionItems: finalSubscription.items, subscriptionDetails: subscriptionDetails});
        if (res.exceededNicotine) {
            saveSubscriptionSuccessText.style.color = "#B05C27";
            saveSubscriptionSuccessText.innerText = "Saved! You've exceeded your prescribed nicotine so your subscription will need re-approval by a doctor";
        } else {
            saveSubscriptionSuccessText.innerText = "Subscription saved successfully!";
        }
        sessionStorage.clear();
    } catch (error) {
        console.log(error);
        saveSubscriptionErrorText.innerText = "Unable to save subscription - an error occurred";
    }
    setTimeout(() => {
        saveSubscriptionButton.innerText = "Save";
        saveSubscriptionErrorText.innerText = "";
        saveSubscriptionSuccessText.innerText = "";
        sessionStorage.clear();
        window.location.reload();
    }, 5000);
}

function createFinalSubscriptionInSessionStorage() {
    var items = JSON.parse(sessionStorage.getItem('lineItems'));
    const userId = getUserId();

    if ((items !== null && !userId) || (items !== null && userId && (sessionStorage.getItem("subscriptionStatus") !== subscriptionStatusEnum.SUBSCRIPTION_ACTIVE.toString()
     && sessionStorage.getItem("subscriptionStatus") !== subscriptionStatusEnum.SUBSCRIPTION_PAYMENT_UNSUCCESSFUL.toString()))) {
        const finalSubscription = {
            items: items,
            schedule: sessionStorage.getItem('subscriptionSchedule'),
            subtotal: sessionStorage.getItem('subtotal'),
            validSubscription:sessionStorage.getItem('validSubscription'),
        }
        finalSubscription.items.map((item, index) => {
            delete item.productDescription;
            delete item.image;
            delete item.url;
            delete item.title;
            delete item.handle;
            delete item.taxable;
            delete item.giftCard;
            delete item.requiresShipping;
            delete item.vendor;
            delete item.id;
            delete item.productType;
            delete item.productTitle;
            delete item.optionsWithValues;

          console.log(item);
            item.quantity = parseInt(item.quantity.value);
            item.variantId = item.variantId.value;
            item.price = item.price.value;
            item.originalPrice = item.originalPrice.value;
            item.discountedPrice = item.discountedPrice.value;
            item.linePrice = item.linePrice.value;
            item.originalLinePrice = item.originalLinePrice.value;
            item.totalDiscount = item.totalDiscount.value;
            item.sku = item.sku.value;
            item.grams = item.grams.value;
            item.productId = item.productId.value;
            item.finalPrice = item.finalPrice.value;
            item.finalLinePrice = item.finalLinePrice.value;
            item.variantTitle = item.variantTitle.value;
        })
        sessionStorage.setItem("finalSubscription",JSON.stringify(finalSubscription));
    } 
}

function mapSubscription(){
    return {
        id: 1,
        total_price: 1,
        subtotal_price: 1,
        applied_discount : 1,
        tax_lines : 1,
        tax_exemptions : 1,
        tax_exempt : 1,
        metafields : 1,
        tags : 1,
        line_items : 1,
        invoice_url : 1,
        invoice_sent_at : 1,
        currency : 1,
        email : 1,
        note_attributes : 1,
        note : 1,
        billing_address : 1,
        shipping_address : 1,
        customer : 1,
        name : 1,
        order_id : 1,
        shipping_line : 1,
        use_customer_default_address : 1,
    }
}

function mapLineItemToDTO(lineItem) {
return {
        id: {value: lineItem.id},
        quantity: {value: lineItem.quantity},
        variantId: {value: lineItem.variant_id},
        title: {value: lineItem.title},
        price: {value: lineItem.price},
        originalPrice: {value: lineItem.original_price},
        discountedPrice: {value: lineItem.discounted_price},
        linePrice: {value: lineItem.line_price},
        originalLinePrice: {value: lineItem.original_line_price},
        totalDiscount: {value: lineItem.total_discount},
        sku: {value: lineItem.sku},
        grams: {value: lineItem.grams},
        vendor: {value: lineItem.vendor },
        taxable: {value: lineItem.taxable},
        productId: {value: lineItem.product_id},
        giftCard: {value: lineItem.gift_card},
        finalPrice: {value: lineItem.final_price},
        finalLinePrice: {value: lineItem.final_line_price},
        url: {value: lineItem.url},
        image: {value: lineItem.image},
        handle: {value: lineItem.handle},
        requiresShipping: {value: lineItem.requires_shipping},
        productType: {value: lineItem.product_type},
        productTitle: {value: lineItem.product_title},
        productDescription: {value: lineItem.product_description},
        variantTitle: {value: lineItem.variant_title},
        optionsWithValues: lineItem.options_with_values,
        properties: lineItem.properties,
}
}

function createSubscriptionLineItemHTML(lineItem) {
var divElement = document.createElement("div");
var titleItem = lineItem.properties.find(o => o.name === '_variant_title')
var nicotineStrength = titleItem ? 'Nicotine Strength: ' + titleItem.value : '';

divElement.innerHTML = `
    <div class="flex items-start relative border-t-2 border-grey-300 last:border-b-2 pt-8 pb-5 sm:py-6 lg:py-8">
    <div class="absolute cursor-pointer top-2 sm:top-6 right-0 flex items-center justify-center bg-red-100 text-red-600 rounded-full w-6 h-6 sm:w-8 sm:h-8">
        <a onclick="removeItemFromSessionStorage('${JSON.stringify(lineItem.id.value).replace(/'/g, '&apos;').replace(/"/g, '&quot;')}')">
        <i class="group-hover:text-black transition duration-100 material-icons-outlined text-base sm:text-lg">close</i>
        </a>
    </div>
    <div class="relative w-28 sm:w-36 lg:w-60 flex-shrink-0">
        <img class="w-full" src="${lineItem.image != undefined ? lineItem.image.value : ''}" alt=${lineItem.title.value} data-cart-item-image>
    </div>
    <div class="w-full pl-4 sm:pl-6 pr-6 sm:pr-12">
        <p class="text-lg sm:text-xl lg:text-2xl leading-tight">${lineItem.title.value}</p>
        <div class="text-base sm:text-lg lg:text-xl text-black sm:mt-1 mb-2">
            <div>
                <span>$${((lineItem.price.value * lineItem.quantity.value)).toFixed(2)}</span>
            </div>                            
        </div>
        <div class="flex items-center w-full">
                <input onblur="changeLineItemQuantityInSessionStorage('${JSON.stringify(lineItem.id.value).replace(/'/g, '&apos;').replace(/"/g, '&quot;')}', this.value)" class="flex-shrink-0 text-base p-3 border border-gray-300 w-20 mr-2" type="number" value="${lineItem.quantity.value}" min="0" pattern="[0-9]*">
                
                <span class="text-base text-grey-400">
                    $${(lineItem.price.value).toFixed(2)} each
                </span>
            </div>
        <div class="text-xs sm:text-sm text-black mt-4 sm:mt-6">
            <div>
            <span class="font-bold">
                        ${nicotineStrength}
                    </span>
            </div>
        </div>

    </div>
</div>
`
return divElement;
}

document.querySelector("#excess-nicotine-popup-cancel").addEventListener('click', function () {
    document.querySelector("#excess-nicotine-popup").style.display = 'none';
    saveSubscriptionButton.innerText = "Save";
    saveSubscriptionErrorText.innerText = "";
    saveSubscriptionSuccessText.innerText = "";
    saveSubscriptionButton.disabled = false;
  }, false);

