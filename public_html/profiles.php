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
					<h2>TEAM STATISTICS (based on fans)</h2>
					<div class="dropdown">
						<button id='dropdown' class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">Choose statistics
							<span class="caret"></span></button>
						<ul class="dropdown-menu">
							<li><a href="#">Man of the Match</a></li>
							<li><a href="#">Goals</a></li>
							<li><a href="#">Best 11</a></li>
							<li><a href="#">Best coming from the bench</a></li>
							<li><a href="#">Best player coming out</a></li>
							<li><a href="#">Team overall performance</a></li>
						</ul>
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




<?php include 'includes/footer.php';?>

<script>
	var swiper = new Swiper('.swiper-container', {
		initialSlide: 0
	});
</script>

</body>
</html>