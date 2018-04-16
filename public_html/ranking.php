<html>
<head>
<?php include 'includes/header.php';?>
<script src="js/ranking.js"></script>
<title>LoudStand - Rankings</title>
</head>

<body onload="initRanking()">
<!-- The surrounding HTML is left untouched by FirebaseUI.
     Your app may use that space for branding, controls and other customizations.-->

<div id="topNav" class="col-xs-12 navbar-inverse navbar-fixed-top">
<?php include 'includes/sidenav.php';?>
    <div class="firstsubtopnav">
        <div class="menu-title">RANKINGS</div>
    </div>
    <div class="secondsubtopnav">

        <div class="left" onclick="displayUserRanking()">USER</div>

        <div class="right"onclick="displayTeamRanking()">TEAM</div>
    </div>
</div>

<div class="overlay"></div>
	<div id = "rankings">
		<div id="userranking"></div>
		<div id="ownteamranking"></div>
		<div id='team'>
			<h2>WORLDWIDE</h2>
			<div id="teamranking"></div>
		</div>
	</div>

<?php include 'includes/footer.php';?>
</body>
</html>