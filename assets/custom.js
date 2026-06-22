$(function(){
  
//  icon_bg_mobile_slider();
  function icon_bg_mobile_slider(){
    if ($(window).width() < 749) {
       $('.icon-bg-mobile-slider .icon-with-text_block-bg').slick({
        dots: true,
        arrows:false,
        speed: 500
       });
    }else{
      if($('.icon-bg-mobile-slider .icon-with-text_block-bg').hasClass('slick-initialized')) {
        $('.icon-bg-mobile-slider .icon-with-text_block-bg').slick('unslick');
      }
    }

   if ($(window).width() < 749) {
       $('.with-prescription-icon-text .icon-with-text_block').slick({
        dots: true,
        arrows:false,
        speed: 500
       });
    }else{
      if($('.with-prescription-icon-text .icon-with-text_block').hasClass('slick-initialized')) {
        $('.with-prescription-icon-text .icon-with-text_block').slick('unslick');
      }
    }
  }

  // $(window).on('resize', function() {
  //   icon_bg_mobile_slider();
  // });

  // var agePopupCookie = getCookie("agePopup");
  // if (agePopupCookie !== 'checked' ) {
  //     $('#age-popup').show();
  //     $('body').addClass('disable-body-overflow--all');
  // }
  // $('#age-popup-enter').on('click', function () {
  //     $('body').removeClass('disable-body-overflow--all');
  //     $('#age-popup').hide();

  //     document.cookie = "agePopup=checked; max-age=" + 900*24*60*60;
  // });
  
  function getCookie(name) {
    // Split cookie string and get all individual name=value pairs in an array
    var cookieArr = document.cookie.split(";");
    
    // Loop through the array elements
    for(var i = 0; i < cookieArr.length; i++) {
        var cookiePair = cookieArr[i].split("=");
        
        /* Removing whitespace at the beginning of the cookie name
        and compare it with the given string */
        if(name == cookiePair[0].trim()) {
            // Decode the cookie value and return
            return decodeURIComponent(cookiePair[1]);
        }
    }
    
    // Return null if not found
    return null;
}




    //if($('.retail-stores-banner').length){
    var urlParams = new URLSearchParams(window.location.search);
    var utm_source = urlParams.get('utm_source');
    if(utm_source != null){
      
        var utm_medium = urlParams.get('utm_medium');
        var utm_campaign = urlParams.get('utm_campaign');
        var utm_content = urlParams.get('utm_content');
        var utm_version = urlParams.get('utm_version');
        var utm_ref = urlParams.get('utm_ref');
        var SessionId = urlParams.get('SessionId');
  
        var withutmparam = "utm_source="+utm_source+"&utm_medium="+utm_medium+"&utm_campaign="+utm_campaign+"&utm_content="+utm_content+"&utm_version="+utm_version+"&utm_ref="+utm_ref+"&SessionId="+SessionId;
        
        $('body a[href="https://portal.myduke.com.au/signup"]').attr('href','https://portal.myduke.com.au/signup?'+withutmparam);
        $('body a[href="https://portal.myduke.com.au/signup/"]').attr('href','https://portal.myduke.com.au/signup?'+withutmparam);
        creategafCookie('UTMQ', withutmparam, 30);

        creategafCookie('utm_source', utm_source, 30);
        creategafCookie('utm_version', utm_version, 30);
        creategafCookie('utm_medium', utm_medium, 30);
        creategafCookie('utm_campaign', utm_campaign, 30);
        creategafCookie('utm_content', utm_content, 30);
        creategafCookie('utm_ref', utm_ref, 30);
        creategafCookie('SessionId', SessionId, 30);
      
     }else if(readgafCookie('UTMQ') != null){
        var UTMQ = readgafCookie('UTMQ');
        $('body a[href="https://portal.myduke.com.au/signup"]').attr('href','https://portal.myduke.com.au/signup?'+UTMQ);
        $('body a[href="https://portal.myduke.com.au/signup/"]').attr('href','https://portal.myduke.com.au/signup?'+UTMQ);
      }
     //}
});


    var creategafCookie = function(name, value, days){
      if (days) {
          var expiry = new Date();
          expiry.setTime(expiry.getTime()+(days*24*60*60*1000));
          var expires = "; expires=" + expiry.toGMTString();
      } else {
          var expires = "";
      }
      document.cookie = escape(name) + "=" + escape(value) + expires + "; path=/;domain=.myduke.com.au";
    }

