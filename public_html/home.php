<html>
<head>
<?php include 'includes/header.php';?>
<script src="js/home.js"></script>
<title>LoudStand</title>
</head>

<?php
$rss = new DOMDocument();
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
for($x=0;$x<$limit;$x++) {
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


<body onload="tutorialHome()">
<!-- The surrounding HTML is left untouched by FirebaseUI.
     Your app may use that space for branding, controls and other customizations.-->

<div id="tutorial">
	<div id="tutorialcontent">
		<b>LOUDSTAND TUTORIAL</b>
		<br>
		<h1>#1 - Home Screen</h1>
		<br>
		<p>Welcome to LoudStand! We're really  This is the Newsfeed. Here you can read all the latest news
			of the World Cup Russia 2018!</p>
	</div>
</div>

<div id="topNav" class="col-xs-12 navbar-inverse navbar-fixed-top">
	<div class="firstsubtopnav">
		<div class="menu-title">NEWSFEED</div>
	</div>
</div>

<div id="news" style=" margin-top: 80px;"></div>



<?php include 'includes/footer.php';?>

</body>
</html>