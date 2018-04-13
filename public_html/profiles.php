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
	<?php include 'sidenav.php';?>
	<div class="firstsubtopnav">
		<div class="menu-title">PROFILES</div>
	</div>
</div>

<h2>User ranking</h2>
<ol id="userranking"></ol>
<h2>Team ranking</h2>
<ol id="teamranking"></ol>

<?php include 'includes/footer.php';?>
</body>
</html>