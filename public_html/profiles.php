<html>
<head>
<?php include 'includes/header.php';?>
<script src="js/profiles.js"></script>
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

        <div class="left" onclick="displayUserRanking()">USER</div>

        <div class="right"onclick="displayTeamRanking()">TEAM</div>
    </div>
</div>

<div class="overlay"></div>
<div id="userprofile">
<div id='ownprofile'></div>
<div id="activity">
	<h2>Last Activity</h2>
</div>
</div>

<?php include 'includes/footer.php';?>
</body>
</html>