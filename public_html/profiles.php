<html>
<head>
	<?php include 'includes/header.php';?>
	<script src="js/ranking.js"></script>
	<script src="js/profiles.js"></script>
	<script src="js/match.js"></script>
	<title>LoudStand - Profiles</title>
</head>

<style>
	body:before {
		background: url("img/backgrounds/england.png") no-repeat center center;
		background-size: cover;
		margin-top: 60px;
	}
</style>

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

<div id="voucheroverlay" class="animated fadeIn" onclick="hideVoucherOverlay();"></div>
<div id="voucheroverlaycontentborder" class="animated fadeIn"></div>
<div id="voucheroverlaycontent" class="animated fadeIn">
	<div class="vouchertitle"><h1>DISCOUNT</h1></div>
	<div id="voucheroverlayinnercontent">
		<div id="voucherdescription"></div>
	</div>
</div>

<!-- Slider main container -->
<div class="swiper-container">
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
			<div id="teamprofile">
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

<script>
	var node = document.getElementById('changebackground');
	node.innerHTML = '<style>body:before {	background: url("../img/backgrounds/belgium.png") no-repeat center center);}</style>';
</script>

<style>
	.slide-to-unlock {
		position: relative;
		width: 90%;
		height: 36px;
	}

	.slide-to-unlock .dragdealer {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		border-radius: 0;
		background: none;
		height: auto;
	}

	.slide-to-unlock .handle {
		height: 100%;
		border-radius: 0;
	}

	.slide-to-unlock .disabled {
		background: none;
	}

	.slide-to-unlock .slide-text {
		position: absolute;
		top: 0;
		height: 80px;
		font-size: 30px;
		line-height: 80px;
		text-align: center;
	}

	.old-slider {
		margin-left: 5%;
		border-radius: 16px;
		background: #222;
		background-image: -webkit-linear-gradient(top, #111 0%, #333 100%);
		background-image: -moz-linear-gradient(top, #111 0%, #333 100%);
		background-image: -o-linear-gradient(top, #111 0%, #333 100%);
		background-image: linear-gradient(to bottom, #fff 0%, #f6f6f6 100%);
		margin-top: 30px;
	}

	.old-slider .dragdealer {
		top: 2px;
		bottom: 2px;
		left: 2px;
		right: 2px;
	}

	.old-slider .slide-text {
		right: 0;
		width: 290px;
		height: 70px;
		color: #999;
		line-height: 70px;
		cursor: default;
	}

	.old-slider .handle {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background: #ccc;
		background-image: -webkit-linear-gradient(top, #f1f1f1 0%, #aaa 100%);
		background-image: -moz-linear-gradient(top, #f1f1f1 0%, #aaa 100%);
		background-image: -o-linear-gradient(top, #f1f1f1 0%, #aaa 100%);
		background-image: linear-gradient(to bottom, #f1f1f1 0%, #333 100%);
	}

</style>

</body>
</html>