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

<h1>AU Football</h1>

<div id="topNav" class="col-xs-12 navbar-inverse navbar-fixed-top">
	<?php include 'includes/sidenav.php';?>
	<div class="firstsubtopnav">
		<div class="menu-title">MATCHES</div>
	</div>
</div>

<div class="overlay"></div>
<div id="news"></div>
<div id="events">
</div>
<div id="teamprofile" class="matches">
	<div id='ownteamranking'></div>
	<div id='matches'>
		<h2>My Matches</h2>
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
	</div>
</div>

<?php include 'includes/footer.php';?>
</body>
</html>