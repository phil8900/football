<html>
<head>
	<?php include 'includes/header.php';?>
	<script src="js/ranking.js"></script>
	<script src="js/profiles.js"></script>
	<script src="js/match.js"></script>
	<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAE0NXJejZApujcdK8c9S7i-G7yblT2kFg&libraries=places&callback=initMap" async defer></script>
	<script src="js/location.js"></script>
	<title>LoudStand - Profiles</title>
</head>

<script>
	var body = document.querySelector('body');
		body.className = 'team' + ownteam;
</script>

<style>
	body.team3299:before {
	background: url("img/backgrounds/england.png") no-repeat center center;
	background-size: cover;
	margin-top: 60px;
}
	




</style>

<body onload="initProfiles()">
<!-- The surrounding HTML is left untouched by FirebaseUI.
     Your app may use that space for branding, controls and other customizations.-->
<div id="tutorial">
	<div id="tutorialcontent">
		<b>LOUDSTAND TUTORIAL</b>
		<br>
		<h1>#2 - Profiles</h1>
		<br>

		<b>USER PROFILE</b>
		<p>In this screen you can know everything about the other fellow football supporters!
			You can see how high in the ranking is the fan, by looking at the top-left corner of the screen
			See how big of a fan someone is is by looking at their fandom level and how many points do they have.
			Also, you can check their latest activity, like where did they watch the last match and how did they
			react to the coach decisions in the last match.</p>
<br>
		<b>TEAM PROFILE</b>
			<p>Here you can know how big a team can be based on the support they get from their fans,
			by checking how high the team is ranking and looking at their fanbase level. Also, you can see the overall
				opinion of the fans about the team on different dimensions, such as Goals, Man of The Match, Starting 11,
				Coach Performance and Team Performance.</p>
		</p>
	</div>
</div>


<div id="map"></div>
<div id="topNav" class="col-xs-12 navbar-inverse navbar-fixed-top">
	<div class="firstsubtopnav">
		<div class="menu-title">PROFILES</div>
	</div>
	<div class="secondsubtopnav">

		<div class="left" onclick="displayUserProfile()">USER</div>

		<div class="right" onclick="displayTeamProfile()">TEAM</div>
	</div>
</div>

<div id="voucheroverlay" class="animated fadeIn" onclick="hideVoucherOverlay();"></div>
<div id="voucheroverlaycontentborder" class="animated fadeIn"></div>
<div id="voucheroverlaycontent" class="animated fadeIn">
	<div class="vouchertitle"><h1>DISCOUNT</h1></div>
	<div id="voucheroverlayinnercontent">
		<div id="voucherdescription"></div>
	</div>
</div>

<!-- Slider main container -->
<div id ="swiperprofiles" class="swiper-container">
	<!-- Additional required wrapper -->
	<div class="swiper-wrapper">
		<!-- Slides -->
		<div class="swiper-slide">
			<div id="userprofile">
				<div id='ownprofile'></div>
				<div id="interactions"></div>
				<div id="activity">
					<h2>LAST ACTIVITY</h2>
				</div>
			</div>
		</div>
		<div class="swiper-slide">
			<div class="teamprofilepadding" id="teamprofile">
				<div id='ownteamranking'></div>
				<div id='squad' class="activitybox activityboxprofiles">
					<h2 style="color: #0F281D">TEAM STATISTICS</h2>
					<br>
					<div class="dropdown">
						<button id='dropdown' class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">Choose statistics
							<span class="caret"></span></button>
						<ul class="dropdown-menu">
							<li onclick="displayStatsMVP();"><a>Man of the Match</a></li>
							<li onclick="displayStatsGoals();"><a>Goals</a></li>
							<li onclick="displayStatsBest11();"><a>Best 11</a></li>
							<li onclick="displayStatsCoach();"><a>Coach overall performance</a></li>
							<li onclick="displayStatsOverall();"><a>Team overall performance</a></li>
						</ul>
					</div>

					<div id="statsdisplay">
						<div id="statsmvp">MVP</div>
						<div id="statsgoals">Goal</div>
						<div id="statsbest11">Best 11</div>
						<div id="statscoach">Coach Statistics
							<div class="coachcount"></div>
						</div>
						<div id="statsoverall">Overall Performance</div>
					</div>
					<div id='keeper'></div>
					<div id='defender'></div>
					<div id='midfielder'></div>
					<div id='striker'></div>
				</div>
			</div>
		</div>
	</div>
</div>

<div id="changebackground"></div>



<?php include 'includes/footer.php';?>

<script>
	var swiper = new Swiper('.swiper-container', {
		initialSlide: 0
	});
</script>


</body>
</html>