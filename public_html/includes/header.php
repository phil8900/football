<script src="https://www.gstatic.com/firebasejs/4.11.0/firebase.js"></script>
<script src="https://www.gstatic.com/firebasejs/4.10.1/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/4.10.1/firebase-auth.js"></script>
<script src="https://www.gstatic.com/firebasejs/4.10.1/firebase-database.js"></script>
<script src="https://www.gstatic.com/firebasejs/4.10.1/firebase-firestore.js"></script>
<script src="https://www.gstatic.com/firebasejs/4.10.1/firebase-messaging.js"></script>
<script src="js/firebase.js"></script>
<script src="js/general.js"></script>
<script src="../node_modules/push.js/bin/push.js"></script>
<script src="../node_modules/push.js/bin/serviceWorker.min.js"></script>
<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.10/css/all.css" integrity="sha384-+d0P83n9kaQMCwj8F4RJB66tzIwOKmrdb46+porD/OvrJ+37WqIM7UoBtwHO6Nlg" crossorigin="anonymous">

<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-117378298-1"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'UA-117378298-1');
    gtag('set', {'user_id': uid}); // Legen Sie die User ID mithilfe des Parameters "user_id" des angemeldeten Nutzers fest.
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
<script src="internallinks.js"></script>
<link href="https://fonts.googleapis.com/css?family=Raleway:300,400,700" rel="stylesheet">

<!-- Swiper API -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/Swiper/4.2.6/css/swiper.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/Swiper/4.2.6/css/swiper.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/Swiper/4.2.6/js/swiper.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/Swiper/4.2.6/js/swiper.min.js"></script>


<script>

    $(document).ready(function() {

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
    }); // end ready

</script>


<link rel="stylesheet" href="css/animate.css">
<link rel="stylesheet" type="text/css" href="css/overwrittenstylesheet.css">
<link rel="stylesheet" type="text/css" href="css/style.css">

