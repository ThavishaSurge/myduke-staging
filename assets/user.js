function useQuery() {
  return new URLSearchParams(window.location.search);
};

function loginAndRedirect(event, root_url) {
  //var PERMITTED_DOMAIN = "https://portal.myduke.com.au";
  var PERMITTED_DOMAIN = "https://portal.myduke.com.au";
  //var LOCALHOST = "http://localhost:3000";

  // only Accept permitted domain from constant PERMITTED_DOMAIN
  if (event.srcElement.referrer.startsWith(PERMITTED_DOMAIN_2) || event.srcElement.referrer.startsWith(PERMITTED_DOMAIN) || event.srcElement.referrer.startsWith(LOCALHOST)) {
    // if token in search parameters, save it in local storage
    var token = useQuery().get('token');
    var previousToken = localStorage.getItem("duke-token");

    if (previousToken) {
      // Logout the currently signed in account
      localStorage.removeItem("duke-token");
    }

    if (token) {
      localStorage.setItem("duke-token", token);
    }
    sessionStorage.clear();
    var redirect_url = useQuery().get('redirect_url');
    // if redirect in search parameters, redirect to it, otherwise to root_url
    var userId = getUserId();
    // alert(userId);
    if (userId) {
      console.log('userlogin');
      // alert(userId);
        
        grpcModule.getCurrentPrescription(userId).then((res) => {
            console.log('userlogin1');
            // alert(res);
            const repeatsLeft = res.result.script.repeatsLeft;
            const scriptExpiry = new Date(0);
            scriptExpiry.setUTCSeconds(res.result.script.scriptCreatedAt.seconds + 365*24*60*60);
            if (repeatsLeft > 0 && scriptExpiry > new Date()) {
                window.location.href = 'https://www.myduke.com.au/pages/shop';
            }else{
              if (redirect_url){
                window.location.href = redirect_url;
              } else {
                window.location.href = root_url;
              }
            }
        }).catch((err) => {
            if (redirect_url){
              window.location.href = redirect_url;
            } else {
              window.location.href = root_url;
            }
        });
    }else{
      alert('invalid user id or no user id');
      if (redirect_url){
        window.location.href = redirect_url;
      } else {
        window.location.href = root_url;
      }
    }
    

    // Clear session storage
    // sessionStorage.clear();
  } else {
    // if domain not allowed, output error and redirect to root url
    alert("Couldn't login, domain not allowed, try again");
    console.error("Domain not allowed", event.srcElement.referrer);
    window.location.href = root_url;
  }
};

function logout() {
  // Logout locally
  localStorage.removeItem('duke-token');

  // Clear session storage
  sessionStorage.clear();

  // expire cart cookie
  document.cookie = 'cart=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';

  // Logout in customer portal
  //window.location.href = "https://portal.myduke.com.au/logout?redirect_url=" + window.location.href;
  //window.location.href = "https://portal.myduke.com.au/logout?redirect_url=" + window.location.href;
  window.location.href = "https://portal.myduke.com.au/logout?redirect_url=https://www.myduke.com.au/";
  
  return false;
}

function getToken() {
  // Get token from local storage OR duke portal
  return localStorage.getItem('duke-token');
};


function tokenPayload() {
  var token = localStorage.getItem('duke-token');
  if (!token) {
    return undefined;
  }
  return parseJwt(token);
};

function parseJwt (token) {
    var base64Url = token.split('.')[1];
      var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));

                  return JSON.parse(jsonPayload);
                  };


function getEmail() {
  const payload = tokenPayload();
  if (!payload) {
    return '';
  }
  return payload.email ? payload.email : '';
}

function getUserId() {
  const payload = tokenPayload();
  if (!payload) {
    return '';
  }
  return payload.sub ?? '';
}

function isAuthenticated() {
  return valid() && tokenPayload !== undefined;
}

function valid() {
  const payload = tokenPayload();
  
  if (!payload || !payload.exp) {
    return false;
  }
  return payload.exp > Date.now() / 1000;
}

function hideProducts(){

  const $authContainer = $('.mydk-product-container-auth');


      if (window.Shopify && window.Shopify.designMode) {
        return;
      }

      if ($authContainer.length) {
          $authContainer.hide();
          // Redirect only if not already on the homepage
          if (window.location.pathname !== '/') {
              window.location.replace('/');
          }
      }
}

