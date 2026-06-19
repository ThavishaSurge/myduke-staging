var userId = getUserId();
var loggedInList = document.getElementsByClassName("userLoggedIn");
var notLoggedInList = document.getElementsByClassName("userNotLoggedIn");
var nicotineList = document.getElementsByClassName("nicotine");
var nicotineblockList = document.getElementsByClassName("nicotineblock");
var nonNicotineList = document.getElementsByClassName("non-nicotine");
var loggedInNonNicotineList = document.getElementsByClassName("logged-in-non-nicotine");
var notLoggedInNonNicotineList = document.getElementsByClassName("not-logged-in-non-nicotine");

// alert(userId);
if (userId) {
    // Get user's current prescription
    if (sessionStorage.getItem("customerPrescriptionValid") == null) {
        grpcModule.getCurrentPrescription(userId).then((res) => {
           console.log('responce will be down here');
           console.log(res);
        //    alert(res);
            const repeatsLeft = res.result.script.repeatsLeft;
            const nicotineAmount = res.result.script.scriptIngredients[0].dose;
            const scriptExpiry = new Date(0);
            scriptExpiry.setUTCSeconds(res.result.script.scriptCreatedAt.seconds + 365*24*60*60);
            if (repeatsLeft > 0 && scriptExpiry > new Date()) {
                sessionStorage.setItem("customerPrescriptionValid", "true");
                sessionStorage.setItem("customernicotineAmount", nicotineAmount);
            } else {
                sessionStorage.setItem("customerPrescriptionValid", "false");
                sessionStorage.setItem("customernicotineAmount", 0);
            }
            renderNicotineContent();
        }).catch((err) => {
            console.log('exception error happened!');
            console.log(err);
            sessionStorage.setItem("customerPrescriptionValid", "false");
            renderNicotineContent();
        });
    }

    for (const element of loggedInList) {
        element.style.display = "inline-block"
    };

    for (const element of notLoggedInList) {
        element.style.display = "none";
    };
} else {
    for (const element of loggedInList) {
        element.style.display = "none"
    };

    sessionStorage.setItem("customerPrescriptionValid", "false");

    for (const element of notLoggedInList) {
        element.style.display = "inline-block";
    };
}

function renderNicotineContent() {
    const customerPrescriptionValid = sessionStorage.getItem("customerPrescriptionValid");
    var userId = getUserId();
    // const invalidPrescription = document.getElementById("invalidPrescription");
    // const nicotineBackToShop = document.getElementById("nicotineBackToShop");
    // const productContainer = document.getElementById("productContainer");

    if (customerPrescriptionValid == "true") {
        for (const element of nicotineList) {
            element.style.display = "inline-block";
        };
        for (const element of nicotineblockList) {
            element.style.display = "block";
        };

        for (const element of nonNicotineList) {
            element.style.display = "none";
        };
        document.querySelectorAll('.customertype_withlogin').forEach(function(el) {el.style.display = 'block';});
        document.querySelectorAll('.customertype_withoutlogin').forEach(function(el) {el.style.display = 'none';});
        document.querySelectorAll('.onlywithlogin').forEach(function(el) {el.style.display = 'block';});
        //$('.header__icons a').html('Shop Now');
        $('.announcement-bar__message .customertype_withlogin').css('display', 'inline');
        //$('.header__icons a').attr('href','/collections/all');
    } else {
        document.querySelectorAll('.customertype_withlogin').forEach(function(el) {el.style.display = 'none';});
        if (userId) {
            for (const element of loggedInNonNicotineList) {
                element.style.display = "inline-block";
            };

            for (const element of notLoggedInNonNicotineList) {
                element.style.display = "none";
            };
        } else {
            for (const element of loggedInNonNicotineList) {
                element.style.display = "none";
            };

            for (const element of notLoggedInNonNicotineList) {
                element.style.display = "inline-block";
            };
        }

        for (const element of nicotineList) {
            element.style.display = "none";
        };
        for (const element of nicotineblockList) {
            element.style.display = "none";
        };

        for (const element of nonNicotineList) {
            element.style.display = "show";
        };
    }
}

renderNicotineContent();

$(document).ready(function () {
  $('.mydk-account-btn').on('click', function () {
    sessionStorage.removeItem('customerPrescriptionValid');
    console.log('customerPrescriptionValid removed');
  });
});
