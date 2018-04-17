<html>
<head>
<?php include 'includes/header.php';?>
<script src="js/ranking.js"></script>
<script src="js/matches.js"></script>
<title>LoudStand - Profiles</title>
</head>

<body onload="initMatches()">
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
<div id="teamprofile" class="matches">
	<div id='ownteamranking'></div>
	<div id='matches'>
		<h2>My Matches</h2>
		<div id='upcoming'></div>
	</div>
</div>

<?php include 'includes/footer.php';?>
</body>
</html>