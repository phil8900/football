<html>
<head>
<?php include 'includes/header.php';?>
<script src="js/voucher.js"></script>
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAE0NXJejZApujcdK8c9S7i-G7yblT2kFg&libraries=places&callback=initMap" async defer></script>
<title>LoudStand - Checkin</title>
</head>

<body onload="showVouchers()">

<div id="topNav" class="col-xs-12 navbar-inverse navbar-fixed-top">
	<?php include 'includes/sidenav.php';?>
	<div class="firstsubtopnav">
		<div class="menu-title">Used vouchers</div>
	</div>
</div>
<div class='overlay'></div>
<div id="vouchers"></div>
<?php include 'includes/footer.php';?>
</body>
</html>