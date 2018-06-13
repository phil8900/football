<?php session_start(); 

// Extend cookie life time by an amount of your liking
$cookieLifetime = 365 * 24 * 60 * 60; // A year in seconds
setcookie(session_name(),session_id(),time()+$cookieLifetime);
?>
<script src="https://www.gstatic.com/firebasejs/4.11.0/firebase.js"></script>
<script src="https://www.gstatic.com/firebasejs/4.10.1/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/4.10.1/firebase-auth.js"></script>
<script src="https://www.gstatic.com/firebasejs/4.10.1/firebase-database.js"></script>
<script src="https://www.gstatic.com/firebasejs/4.10.1/firebase-firestore.js"></script>
<script src="https://www.gstatic.com/firebasejs/4.10.1/firebase-messaging.js"></script>
<script type="text/javascript" src="https://www.datejs.com/build/date.js"></script>
<script src="js/firebase.js"></script>
<script src="js/general.js"></script>
<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.10/css/all.css" integrity="sha384-+d0P83n9kaQMCwj8F4RJB66tzIwOKmrdb46+porD/OvrJ+37WqIM7UoBtwHO6Nlg" crossorigin="anonymous">

<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-120812054-1"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'UA-120812054-1');
</script>

<!-- Hotjar Tracking Code for www.loudstand.com -->
<script>
    (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:910619,hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
</script>




<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui">
<meta name="apple-mobile-web-app-capable" content="yes"/>
<!-- Chrome, Firefox OS and Opera -->
<meta name="theme-color" content="#0F281D">
<!-- Windows Phone -->
<meta name="msapplication-navbutton-color" content="#0F281D">
<!-- iOS Safari -->
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<link rel="apple-touch-icon-precomposed" sizes="57x57" href="fan%20teste%203-02.png"/>
<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
<link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet">
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
<link href="https://fonts.googleapis.com/css?family=Raleway:300,400,700" rel="stylesheet">
<script src="js/dragdealer.js"></script>


<!-- Swiper API -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/Swiper/4.2.6/css/swiper.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/Swiper/4.2.6/css/swiper.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/Swiper/4.2.6/js/swiper.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/Swiper/4.2.6/js/swiper.min.js"></script>


<script>

    $(document).ready(function() {
		if(swiper != undefined){
        swiper.on('slideChange', function () {

            if (swiper.activeIndex == 0) {
                $(".right").css('background-color', '#0F281D');
                $(".left").css('background-color', '#2c7656');

            }

            if (swiper.activeIndex == 1) {
                $(".left").css('background-color', '#0F281D');
                $(".right").css('background-color', '#2c7656');
            }

        })
			}
    }); // end ready


</script>


<link rel="stylesheet" href="css/animate.css">
<link rel='stylesheet' href='css/slidetounlock.css'>
<link rel="stylesheet" type="text/css" href="css/overwrittenstylesheet.css">
<link rel="stylesheet" href="css/style.css?ver=1.18" media="screen" />





<div id="overlayloading">
    <div id="loading">
        <div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>
</div>

<style>
    #overlayloading{
        position:fixed;
        height: 100%;
        width: 100%;
        z-index:9998;
        top:0;
        left:0;
        bottom:0;
        right:0;
        background:rgba(0,0,0,0.9);
        transition: 1s 0.4s;
    }

    #loading{
        position:fixed;
        height: 100%;
        width: 100%;
        z-index: 9999;
        top: 40%;
        left: 40%;
        bottom:0;
        right:0;
    }

    /* ------------------- */

    .lds-spinner {
        color: #f6f6f6;
        width: 64px;
        height: 64px;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .lds-spinner div {
        transform-origin: 32px 32px;
        animation: lds-spinner 1.2s linear infinite;
    }
    .lds-spinner div:after {
        content: " ";
        display: block;
        position: absolute;
        top: 3px;
        left: 29px;
        width: 5px;
        height: 14px;
        border-radius: 20%;
        background: #fff;
    }
    .lds-spinner div:nth-child(1) {
        transform: rotate(0deg);
        animation-delay: -1.1s;
    }
    .lds-spinner div:nth-child(2) {
        transform: rotate(30deg);
        animation-delay: -1s;
    }
    .lds-spinner div:nth-child(3) {
        transform: rotate(60deg);
        animation-delay: -0.9s;
    }
    .lds-spinner div:nth-child(4) {
        transform: rotate(90deg);
        animation-delay: -0.8s;
    }
    .lds-spinner div:nth-child(5) {
        transform: rotate(120deg);
        animation-delay: -0.7s;
    }
    .lds-spinner div:nth-child(6) {
        transform: rotate(150deg);
        animation-delay: -0.6s;
    }
    .lds-spinner div:nth-child(7) {
        transform: rotate(180deg);
        animation-delay: -0.5s;
    }
    .lds-spinner div:nth-child(8) {
        transform: rotate(210deg);
        animation-delay: -0.4s;
    }
    .lds-spinner div:nth-child(9) {
        transform: rotate(240deg);
        animation-delay: -0.3s;
    }
    .lds-spinner div:nth-child(10) {
        transform: rotate(270deg);
        animation-delay: -0.2s;
    }
    .lds-spinner div:nth-child(11) {
        transform: rotate(300deg);
        animation-delay: -0.1s;
    }
    .lds-spinner div:nth-child(12) {
        transform: rotate(330deg);
        animation-delay: 0s;
    }
    @keyframes lds-spinner {
        0% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }

</style>


<script>
    $(window).on('load', function () {
        $('#overlayloading').fadeOut("slow");
});
</script>