<html>
<head>
<?php include 'header.php';?>
<script src="js/matches.js"></script>
<title>LoudStand - Profiles</title>
</head>

<body onload="initMatches()">
<!-- The surrounding HTML is left untouched by FirebaseUI.
     Your app may use that space for branding, controls and other customizations.-->
<h1>AU Football</h1>

<div id="topNav" class="col-xs-12 navbar-inverse navbar-fixed-top">
	<?php include 'sidenav.php';?>
	<div class="firstsubtopnav">
		<div class="menu-title">MATCHES</div>
	</div>
</div>

<h2>User ranking</h2>
<ol id="userranking"></ol>
<h2>Team ranking</h2>
<ol id="teamranking"></ol>

<?php include 'footer.php';?>
</body>
</html>