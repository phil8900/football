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
<div id="topNav" class="col-xs-12 navbar-inverse navbar-fixed-top">
	<div class="firstsubtopnav">
		<div class="menu-title">MATCHES</div>
	</div>
</div>

<div id="teamprofile" class="matches">
	<div id='matches'>
		<div class="swiper-container">
			<div class="swiper-wrapper">
			</div>
		</div>
	</div>
</div>

<?php include 'includes/footer.php';?>


</body>
</html>