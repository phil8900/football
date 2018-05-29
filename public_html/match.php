<html>
<head>
	<?php include 'includes/header.php';?>
	<script src="js/match.js"></script>
	<script src="js/ranking.js"></script>
	<script src="js/home.js"></script>
	<script src="js/profiles.js"></script>
	<script src="js/matches.js"></script>
</head>

<body onload="initMatch();initMatches();">
<!-- The surrounding HTML is left untouched by FirebaseUI.
     Your app may use that space for branding, controls and other customizations.-->


<div id="topNav" class="col-xs-12 navbar-inverse navbar-fixed-top">
	<div class="firstsubtopnav">
		<div class="menu-title">DIGITAL STADIUM</div>
	</div>
</div>

<!--

<div class="overlay"></div>
<div id="news"></div>
<div id="teamprofile" class="matches">
	<div id='ownteamranking'></div>
	<div id='matches'>
		<h2>My Matches</h2>

		-->

<div id="score">
	<span id="currentscore">0:0</span>
	<span id="location"></span>
	<br>
	<span id="time"></span>
</div>


<!-- Slider main container -->
<div class="swiper-container" style="height: 7000px">
	<!-- Additional required wrapper -->
	<div class="swiper-wrapper">
		<!-- Slides -->
		<div class="swiper-slide">
			<div id="statistics">DISPLAY WHATEVER STATS HERE</div>
		</div>

		<div class="swiper-slide">
			<div id="latestgameevent" class="maininteraction activitybox"></div>
			<br>

			<div class="interaction1">INTERACTION 1 (UPVOTE/DOWNVOTE?)</div>
			<div class="interaction2" onclick="on()">CALL TO ACTION (VOUCHER FOR BEER?/INVITE A FRIEND?</div>
		</div>

		<div class="swiper-slide">
			<div id="eventshistory">
				<div id="events"></div>
			</div>
		</div>
	</div>
</div>

<!--

		<div id='upcoming'>
			<div id='homesquad'>
				<div class='starting'>
					<h2>Starting 11</h2>
					<div class='keeper'></div>
					<div class='defender'></div>
					<div class='midfielder'></div>
					<div class='striker'></div>
				</div>
				<div class="bench">
					<h2>Bench</h2>
				</div>
			</div>
			<div id='awaysquad'>
				<div class='starting'>
					<h2>Starting 11</h2>
					<div class='keeper'></div>
					<div class='defender'></div>
					<div class='midfielder'></div>
					<div class='striker'></div>
				</div>
				<div class="bench">
					<h2>Bench</h2>
				</div>
			</div>
		</div>

-->

<?php include 'includes/footer.php';?>

<!-- CLEAN LATER -->

<script>

	$(document).ready(function() {

		swiper.on('slideChange', function () {

			if (swiper.activeIndex == 0) {
				$(".menu-title").text("STATS");
			}

			if (swiper.activeIndex == 1) {
				$(".menu-title").text("DIGITAL STADIUM");
			}

			if (swiper.activeIndex == 2) {
				$(".menu-title").text("MATCH EVENTS");
			}

		})
	}); // end ready


</script>

<script>
	var voucher = new Swiper('.voucherswiper-container', {
	});

	var swiper = new Swiper('.swiper-container', {
		initialSlide: 1
	});
</script>

<script src="https://code.jquery.com/jquery-3.2.0.min.js"></script>

</body>
</html>