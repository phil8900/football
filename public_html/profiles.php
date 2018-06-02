<html>
<head>
<?php include 'includes/header.php';?>
<script src="js/ranking.js"></script>
<script src="js/profiles.js"></script>
<script src="js/match.js"></script>
<title>LoudStand - Profiles</title>
</head>

<body onload="initProfiles()">
<!-- The surrounding HTML is left untouched by FirebaseUI.
     Your app may use that space for branding, controls and other customizations.-->

<div id="topNav" class="col-xs-12 navbar-inverse navbar-fixed-top">
	<div class="firstsubtopnav">
		<div class="menu-title">PROFILES</div>
	</div>
    <div class="secondsubtopnav">

        <div class="left" onclick="displayUserProfile()">USER</div>

        <div class="right" onclick="displayTeamProfile()">TEAM</div>
    </div>
</div>

<!-- Slider main container -->
<div class="swiper-container" style="height: 2340px;">
	<!-- Additional required wrapper -->
	<div class="swiper-wrapper">
		<!-- Slides -->
		<div class="swiper-slide">
			<div id="userprofile">
				<div id='ownprofile'></div>
				<div id="activity">
					<h2>LAST ACTIVITY</h2>
				</div>
			</div>
		</div>
		<div class="swiper-slide">
			<div id="teamprofile">
				<div id='ownteamranking'></div>
				<div id='squad'>
					<h2>SQUAD</h2>
					<div id='keeper'></div>
					<div id='defender'></div>
					<div id='midfielder'></div>
					<div id='striker'></div>
				</div>
			</div>
		</div>
	</div>
</div>




<?php include 'includes/footer.php';?>

<script>
	var swiper = new Swiper('.swiper-container', {
		initialSlide: 0
	});
</script>

</body>
</html>