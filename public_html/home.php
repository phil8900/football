<html>
<head>
<?php include 'header.php';?>
<script src="js/home.js"></script>
<title>LoudStand</title>
</head>

<body onload="initHome()">
<!-- The surrounding HTML is left untouched by FirebaseUI.
     Your app may use that space for branding, controls and other customizations.-->
<h1>Home</h1>

<div id="topNav" class="col-xs-12 navbar-inverse navbar-fixed-top">
	<?php include 'sidenav.php';?>
	<div class="firstsubtopnav">
		<div class="menu-title">HOME</div>
	</div>
</div>

<div id="news"></div>

<?php include 'footer.php';?>

</body>
</html>