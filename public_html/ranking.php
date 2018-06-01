<html>
<head>
	<?php include 'includes/header.php';?>
	<script src="js/ranking.js"></script>
	<title>LoudStand - Rankings</title>
</head>

<body onload="initRanking()">
<!-- The surrounding HTML is left untouched by FirebaseUI.
     Your app may use that space for branding, controls and other customizations.-->

<div id="topNav" class="col-xs-12 navbar-inverse navbar-fixed-top">
	<div class="firstsubtopnav">
		<div class="menu-title">RANKINGS</div>
	</div>
	<div class="secondsubtopnav">

		<div class="left" onclick="displayUserRanking()">USER</div>

		<div class="right"onclick="displayTeamRanking()">TEAM</div>
	</div>
</div>

<!-- Slider main container -->
<div class="swiper-container" style="height: 2340px;">
	<!-- Additional required wrapper -->
	<div class="swiper-wrapper">
		<!-- Slides -->
		<div class="swiper-slide">
			<div id = "rankings">
				<h2>USERS WORLWIDE</h2>
				<div id="userranking"></div>
				<div id="ownteamranking"></div>
			</div>
		</div>
		<div class="swiper-slide">
			<div id='team'>
				<h2>TEAMS WORLDWIDE</h2>
				<div id="teamranking"></div>
			</div>
		</div>
	</div>
</div>

<script>
	var swiper = new Swiper('.swiper-container', {
		initialSlide: 0
	});
</script>

<?php include 'includes/footer.php';?>
</body>
</html>