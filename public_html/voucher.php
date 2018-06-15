<html>
<head>
	<?php include 'includes/header.php';?>
	<script src="js/voucher.js"></script>
	<title>LoudStand - Checkin</title>
</head>

<body onload="enterButton()">

<style>
	body{
		display: block;
		visibility: visible;
	}
</style>

<div id="topNav" class="col-xs-12 navbar-inverse navbar-fixed-top">
	<div class="firstsubtopnav">
		<div class="menu-title">USED VOUCHERS</div>
	</div>
</div>

<div id="barsoverlay">
	<input id="password" placeholder="Password...">
	<button type="button" id="submitpassword" onclick="barsLogin()">Submit!</button>
	<p id="errormessage"></p>
</div>

<div id="vouchers"></div>
<div id="totalcount"></div>
<?php include 'includes/footer.php';?>
</body>

<script>
	document.getElementById("footer").style.display = "none";
</script>
</html>