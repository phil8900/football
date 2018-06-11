<?php
require 'scraper.php';

echo 'Startet Livescraper';

$livegames = getLiveGames();

foreach ($livegames as $key => $value) {
	setGameEvents($value);
	setStartingEleven($value);
	setGameStats($value);
}

?>