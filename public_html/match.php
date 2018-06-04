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
	<div class="firstsubtopnavmatchinteraction">
		<div class="menu-icon">
			<a href="matches.php"><img src="img/back.png"></a>
		</div>
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

<div id="voucheroverlay" class="animated fadeIn" onclick="hideVoucherOverlay();"></div>
<div id="voucheroverlaycontentborder" class="animated fadeIn"></div>
<div id="voucheroverlaycontent" class="animated fadeIn">
	<div class="vouchertitle"><h1>DISCOUNT</h1></div>
	<div id="voucheroverlayinnercontent">
	<div id="voucherdescription">
	</div>
</div>
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
			<div id="teamprofile">
				<div id='ownteamranking' style="display: none;"></div>
				<div id='squad' class="starting11 activitybox">
					<h2>MAKE YOUR OWN STARTING 11</h2>
					<div id='keeper'></div>
					<div id='defender'></div>
					<div id='midfielder'></div>
					<div id='striker'></div>
				</div>
			</div>
			<br>

			<div id="interactions">
				<div id="postmatchcontainer" class="activitybox">
					<div class="innercontainer">
						<div id="mvp">
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
							</div>
						</div>
					</div>

				</div>
			</div>

		</div>

		<div class="swiper-slide">
			<div id="eventshistory">
				<div id="events"></div>
			</div>
		</div>
	</div>
</div>

<!--



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
	var swiper = new Swiper('.swiper-container', {
		initialSlide: 1
	});
</script>

<script src="https://code.jquery.com/jquery-3.2.0.min.js"></script>

</body>
</html>