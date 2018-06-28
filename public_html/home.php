<html>
<head>
<?php include 'includes/header.php';?>
<script src="js/home.js"></script>
<title>LoudStand</title>
</head>

<?php
$rss = new DOMDocument();
$rss->encoding = 'utf-8';
$rss->load('http://www.espnfc.com/fifa-world-cup/4/rss');


$feed = array();
foreach ($rss->getElementsByTagName('item') as $node) {
	$item = array (
		'title' => $node->getElementsByTagName('title')->item(0)->nodeValue,
		'desc' => $node->getElementsByTagName('description')->item(0)->nodeValue,
		'link' => $node->getElementsByTagName('link')->item(0)->nodeValue,
		'date' => $node->getElementsByTagName('pubDate')->item(0)->nodeValue,
	);
	array_push($feed, $item);
}

$limit = 20;
for($x=0; $x<$limit && $x<count($feed) ;$x++) {
	$title = str_replace(' & ', ' &amp; ', $feed[$x]['title']);
	$link = $feed[$x]['link'];
	$description = $feed[$x]['desc'];
	$date = date('l F d, Y', strtotime($feed[$x]['date']));

	echo '<div class="activitybox newsboxes">';
	echo '<small class="date"><em>'.$date.'</em></small></p>';
	echo '<p><strong><h2 class="title" style="color: #0b2e13">'.$title.'</h2></strong></p><br />';
	echo '<div class="newsdescription"><p class="newstitle">'.$description.'</p></div>';
	echo '</div>';
}


?>


<body onload="tutorialHome();initHome()">
<!-- The surrounding HTML is left untouched by FirebaseUI.
     Your app may use that space for branding, controls and other customizations.-->

<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-593ZT37"
				  height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->

<div id="tutorial" onclick="$('#tutorial').fadeOut();">
	<div id="tutorialcontent">
		<div id="closetutorial" onclick="$('#tutorial').fadeOut();">X</div>
		<b>LOUDSTAND TUTORIAL</b>
		<br>
		<h1>#1 - Home Screen</h1>
		<br>
		<p>Thank you for helping us testing the BETA version of LoudStand, a digital stadium that
			brings football back to fans! Yes, it might be slow and have some bugs here and there,
			but we are counting on you to help us improve :) </p>

		<p>In the News screen, you will find the latest news on the World Cup. Enjoy the experience!</p>
		</p>
	</div>
</div>

<div id="topNav" class="col-xs-12 navbar-inverse navbar-fixed-top">
	<div class="firstsubtopnav">
		<div class="menu-title">NEWS</div>
	</div>
</div>

<div id="news" style=" margin-top: 80px;"></div>



<?php include 'includes/footer.php';?>

</body>
</html>