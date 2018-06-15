<html>
<head>
	<?php include 'includes/header.php';?>
	<script src="js/ranking.js"></script>
	<title>LoudStand</title>
</head>

<body onload="initRanking()">

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
		<h1>#3 - Rankings</h1>
		<br>

		<b>USER RANKING</b>
		<p>How big of a fan are you? See your position and go up in the ranking by supporting your team and gaining points.
			How can you make points? Just check-in when the next match of your team starts and react to the live
			match events popping up in your screen! Give your opinion and help your team go up.</p>
		<br>
		<b>TEAM RANKING</b>
		<p>Which team has the biggest supporters? Does your team have the most active supporters in the World Cup?
			Keep supporting your team during the matches and help them achieve the first place of the Teams Ranking.</p>
		</p>
	</div>
</div>


<div id="topNav" class="col-xs-12 navbar-inverse navbar-fixed-top">
	<div class="firstsubtopnav">
		<div class="menu-title">RANKINGS</div>
	</div>
	<div class="secondsubtopnav">

		<div class="left" onclick="displayUserRanking()">FANS</div>

		<div class="right"onclick="displayTeamRanking()">TEAMS</div>
	</div>
</div>

<!-- Slider main container -->
<div class="swiper-container" id="rankingcontainer" style="height: 2340px;">
	<!-- Additional required wrapper -->
	<div class="swiper-wrapper">
		<!-- Slides -->
		<div class="rankingswipe swiper-slide">
			<div id = "rankings">
				<!-- <h2>USERS WORLWIDE</h2> -->
				<div id="userranking" class="activityboxranking"></div>
				<div id="ownteamranking"></div>
			</div>
		</div>
		<div class="rankingswipe swiper-slide">
			<div id='team'>
				<!--	<h2>TEAMS WORLDWIDE</h2> -->
				<div id="teamranking" class="activityboxranking"></div>
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