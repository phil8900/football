<?php
require 'scraper.php';

echo 'Started Livescraper';

$livegames = getLiveGames();

foreach ($livegames as $key => $value) {
	setGameEvents($value);
	setStartingEleven($value);
	setGameStats($value);
}

?>