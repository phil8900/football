<html>
<head>
<?php include 'includes/header.php';?>
<script src="js/location.js"></script>
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAE0NXJejZApujcdK8c9S7i-G7yblT2kFg&libraries=places&callback=initMap" async defer></script>
</head>

<body onload="setOwnTeam()">
<!-- The surrounding HTML is left untouched by FirebaseUI.
     Your app may use that space for branding, controls and other customizations.-->
<h1>AU Football</h1>
<div id="map"></div>
<div id="results"></div>
</body>
</html>