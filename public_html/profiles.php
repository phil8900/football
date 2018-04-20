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
<h1>AU Football</h1>

<div id="topNav" class="col-xs-12 navbar-inverse navbar-fixed-top">
	<?php include 'includes/sidenav.php';?>
	<div class="firstsubtopnav">
		<div class="menu-title">PROFILES</div>
	</div>
    <div class="secondsubtopnav">

        <div class="left" onclick="displayUserProfile()">USER</div>

        <div class="right"onclick="displayTeamProfile()">TEAM</div>
    </div>
</div>

<div class="overlay"></div>
<div id="userprofile">
	<div id='ownprofile'></div>
	<div id="activity">
		<h2>Last Activity</h2>
	</div>
</div>
<div id="teamprofile">
	<div id='ownteamranking'></div>
	<div id='squad'>
		<div id='keeper'></div>
		<div id='defender'></div>
		<div id='midfielder'></div>
		<div id='striker'></div>
	</div>
</div>

<?php include 'includes/footer.php';?>
</body>
</html>