<html>
<head>
<?php include 'includes/header.php';?>
<script src="js/ranking.js"></script>
<script src="js/location.js"></script>
<script src="js/matches.js"></script>
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAE0NXJejZApujcdK8c9S7i-G7yblT2kFg&libraries=places&callback=initMap" async defer></script>

	<title>LoudStand</title>
</head>

<body onload="initMatches(true)" style="margin-top: 40px">

<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-593ZT37"
				  height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
<!-- The surrounding HTML is left untouched by FirebaseUI.
     Your app may use that space for branding, controls and other customizations.-->

<div id="tutorial" onclick="$('#tutorial').fadeOut();">
	<div id="tutorialcontent">
		<div id="closetutorial" onclick="$('#tutorial').fadeOut();">X</div>
		<b>LOUDSTAND TUTORIAL</b>
		<br>
		<h1>#4 - Matches Calendar</h1>
		<br>

		<p>Access the complete list of fixtures of your Team’s Group. Before the next match of your team
			starts, the “LIVE” sign will show up in the match box. All you have to do is to click on the match
			and CHECK-IN. Just choose your location by clicking in one of the options suggested in the list.
			Type in the search bar to find the right location. If you are watching the match in one the LoudStand partners,
			remember to type the name of the sports bar where you are and choose. </p>

			<p>Hopefully they will make it to the Knockout Phase thanks to their fans’ support :) </p>


	</div>
</div>


<div id="topNav" class="col-xs-12 navbar-inverse navbar-fixed-top">
	<div class="firstsubtopnav" id="firstsubtopnav">
		<div class="menu-title" onclick="overlayOff();">CALENDAR</div>
	</div>
</div>



<div id='overlay' class="overlay animated fadeIn" style="padding-top: 40px;">
	<input id="pac-input" class="controls" type="text" placeholder="Search location...">

	<div id="map"></div>
<div id="results"></div>
<div id="placesresult" style="display:none;"></div>
</div>

<div id="matchescontainer teamprofile" class="matches">
	<div id='matches'>
		<div class="swiper-container">
			<div class="swiper-wrapper">
			</div>
		</div>
	</div>
</div>


<style>
	#teamprofile{
		clear:both;
		padding-top: 20px;

	}

	#teamprofile.matches, #teamprofile.matches #ownteamranking{
		display:block;
		text-align:center;
	}

	.swiper-container{
		height: 100%;
		overflow: hidden;
	}

	.swiper-wrapper{
		height: 95%;
	}
</style>



<?php include 'includes/footer.php';?>
<style>
	.swiper-slide{
		overflow: visible;
</style>

</body>
</html>