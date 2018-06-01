<html>
<head>
<?php include 'includes/header.php';?>
<script src="js/location.js"></script>
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAE0NXJejZApujcdK8c9S7i-G7yblT2kFg&libraries=places&callback=initMap" async defer></script>

	<title>LoudStand - Checkin</title>

</head>

<body onload="setOwnTeam()">

<div id="topNav" class="col-xs-12 navbar-inverse navbar-fixed-top">
	<div class="firstsubtopnav">
		<div class="menu-title">CHECKIN</div>
	</div>
</div>

<input id="pac-input" class="controls" type="text" placeholder="Search location...">

<div class="overlay">
<div id="map"></div>
<div id="results"></div>
<div id="placesresult" style="display:none;"></div>
	</div>
<?php include 'includes/footer.php';?>
</body>
</html>