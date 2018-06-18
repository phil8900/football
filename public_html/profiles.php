<html>
<head>
	<?php include 'includes/header.php';?>
	<script src="js/ranking.js"></script>
	<script src="js/profiles.js"></script>
	<script src="js/match.js"></script>
	<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAE0NXJejZApujcdK8c9S7i-G7yblT2kFg&libraries=places&callback=initMap" async defer></script>
	<script src="js/location.js"></script>
	<title>LoudStand</title>
</head>

<script>
	var body = document.querySelector('body');

	body.className = 'team' + ownteam;
</script>

<style>
	body.team3262:before {
		background: url("img/backgrounds/germany.png") no-repeat center center;
		background-size: cover;
		margin-top: 60px;
	}

	body.team3299:before {
		background: url("img/backgrounds/england.png") no-repeat center center;
		background-size: cover;
		margin-top: 60px;
	}

	body.team3300:before {
		background: url("img/backgrounds/portugal.png") no-repeat center center;
		background-size: cover;
		margin-top: 60px;
	}

	body.team3375:before {
		background: url("img/backgrounds/spain.png") no-repeat center center;
		background-size: cover;
		margin-top: 60px;
	}

	body.team3377:before {
		background: url("img/backgrounds/france.png") no-repeat center center;
		background-size: cover;
		margin-top: 60px;
	}

	body.team3382:before {
		background: url("img/backgrounds/belgium.png") no-repeat center center;
		background-size: cover;
		margin-top: 60px;
	}

	body.team3384:before {
		background: url("img/backgrounds/switzerland.png") no-repeat center center;
		background-size: cover;
		margin-top: 60px;
	}

	body.team3433:before {
		background: url("img/backgrounds/australia.png") no-repeat center center;
		background-size: cover;
		margin-top: 60px;
	}

	body.team3435:before {
		background: url("img/backgrounds/japan.png") no-repeat center center;
		background-size: cover;
		margin-top: 60px;
	}

	body.team3436:before {
		background: url("img/backgrounds/denmark.png") no-repeat center center;
		background-size: cover;
		margin-top: 60px;
	}

	body.team3437:before {
		background: url("img/backgrounds/argentina.png") no-repeat center center;
		background-size: cover;
		margin-top: 60px;
	}

	body.team3438:before {
		background: url("img/backgrounds/serbia.png") no-repeat center center;
		background-size: cover;
		margin-top: 60px;
	}

	body.team3439:before {
		background: url("img/backgrounds/brazil.png") no-repeat center center;
		background-size: cover;
		margin-top: 60px;
	}

	body.team3442:before {
		background: url("img/backgrounds/poland.png") no-repeat center center;
		background-size: cover;
		margin-top: 60px;
	}

	body.team3444:before {
		background: url("img/backgrounds/nigeria.png") no-repeat center center;
		background-size: cover;
		margin-top: 60px;
	}

	body.team3448:before {
		background: url("img/backgrounds/russia.png") no-repeat center center;
		background-size: cover;
		margin-top: 60px;
	}

	body.team3449:before {
		background: url("img/backgrounds/uruguay.png") no-repeat center center;
		background-size: cover;
		margin-top: 60px;
	}

	body.team3499:before {
		background: url("img/backgrounds/senegal.png") no-repeat center center;
		background-size: cover;
		margin-top: 60px;
	}

	body.team3556:before {
		background: url("img/backgrounds/croatia.png") no-repeat center center;
		background-size: cover;
		margin-top: 60px;
	}

	body.team3557:before {
		background: url("img/backgrounds/sweden.png") no-repeat center center;
		background-size: cover;
		margin-top: 60px;
	}

	body.team3574:before {
		background: url("img/backgrounds/iceland.png") no-repeat center center;
		background-size: cover;
		margin-top: 60px;
	}

	body.team3575:before {
		background: url("img/backgrounds/morocco.png") no-repeat center center;
		background-size: cover;
		margin-top: 60px;
	}

	body.team3577:before {
		background: url("img/backgrounds/panama.png") no-repeat center center;
		background-size: cover;
		margin-top: 60px;
	}

	body.team3582:before {
		background: url("img/backgrounds/iran.png") no-repeat center center;
		background-size: cover;
		margin-top: 60px;
	}

	body.team3584:before {
		background: url("img/backgrounds/peru.png") no-repeat center center;
		background-size: cover;
		margin-top: 60px;
	}

	body.team3589:before {
		background: url("img/backgrounds/southkorea.png") no-repeat center center;
		background-size: cover;
		margin-top: 60px;
	}

	body.team3670:before {
		background: url("img/backgrounds/tunisia.png") no-repeat center center;
		background-size: cover;
		margin-top: 60px;
	}

	body.team3672:before {
		background: url("img/backgrounds/egypt.png") no-repeat center center;
		background-size: cover;
		margin-top: 60px;
	}

	body.team3807:before {
		background: url("img/backgrounds/saudiarabia.png") no-repeat center center;
		background-size: cover;
		margin-top: 60px;
	}

	body.team3816:before {
		background: url("img/backgrounds/colombia.png") no-repeat center center;
		background-size: cover;
		margin-top: 60px;
	}

	body.team6303:before {
		background: url("img/backgrounds/mexico.png") no-repeat center center;
		background-size: cover;
		margin-top: 60px;
	}

	body.team8497:before {
		background: url("img/backgrounds/costarica.png") no-repeat center center;
		background-size: cover;
		margin-top: 60px;
	}

</style>

<body onload="initProfiles()">

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
		<h1>#2 - Profiles</h1>
		<br>

		<b>USER PROFILE</b>
		<p>In this screen you can know everything about a football fan! You can see how high in the ranking is the
			fan, by looking at the top-left corner of the screen. See how big of a fan someone is by
			looking at their fandom level and how many points do they have. Also, you can check
			their latest activity, like where did they watch the last match and how did they react to the
			coach decisions in the last match.</p>
		<br>
		<b>TEAM PROFILE</b>
		<p>By clicking “MY TEAM” on the upper right corner, you can see how big a national team is based on
			the support they get from their fans! Check how high the team is ranked and look at their fan level. We are
			soon launching a new feature that will give you the best statistics of your team based on your team's fans opinion.</p>
	</div>
</div>


<div id="map"></div>
<div id="topNav" class="col-xs-12 navbar-inverse navbar-fixed-top">
	<div class="firstsubtopnav">
		<div class="menu-title">PROFILES</div>
		<div id="feedback"><i class="far fa-comment" onclick="openFeedback();"></i></div>
		<div id="feedbackoverlay">
			<div id="feedbackoverlaycross" onclick="closeFeedback();">X</div>
		<div id="feedbackoverlaycontent">Give us your feedback! How can we improve?<br><br>
			<textarea id="feedbacktext"></textarea></div>
			<button id="feedbackoverlaysubmit">Submit!</button>
		</div>
	</div>
	<div class="secondsubtopnav">

		<div class="left" onclick="displayUserProfile()">ME</div>

		<div class="right" onclick="displayTeamProfile()">MY TEAM</div>
	</div>
</div>

<div id="voucheroverlay" class="animated fadeIn" onclick="hideVoucherOverlay();"></div>
<div id="voucheroverlaycontentborder" class="animated fadeIn"></div>
<div id="voucheroverlaycontent" class="animated fadeIn" style="top: 20%;">
	<div id="closetutorial" onclick="$('#voucheroverlay').fadeOut(); $('#voucheroverlaycontent').fadeOut();">X</div>
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