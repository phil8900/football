<html>
<head>
<?php include 'includes/header.php';?>
<script src="js/ranking.js"></script>
<script src="js/location.js"></script>
<script src="js/matches.js"></script>
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAE0NXJejZApujcdK8c9S7i-G7yblT2kFg&libraries=places&callback=initMap" async defer></script>

	<title>LoudStand - Profiles</title>
</head>

<body onload="initMatches()" style="margin-top: 40px">
<!-- The surrounding HTML is left untouched by FirebaseUI.
     Your app may use that space for branding, controls and other customizations.-->
<div id="topNav" class="col-xs-12 navbar-inverse navbar-fixed-top">
	<div class="firstsubtopnav" id="firstsubtopnav">
		<div class="menu-title" onclick="overlayOff();">MATCHES</div>
	</div>
</div>



<div id='overlay' class="overlay animated fadeIn" style="padding-top: 40px;">
	<input id="pac-input" class="controls" type="text" placeholder="Search location...">

	<div id="map"></div>
<div id="results"></div>
<div id="placesresult" style="display:none;"></div>
</div>

<div id="teamprofile" class="matches">
	<div id='matches'>
		<div class="swiper-container">
			<div class="swiper-wrapper">
			</div>
		</div>
	</div>
</div>



<?php include 'includes/footer.php';?>


</body>
</html>