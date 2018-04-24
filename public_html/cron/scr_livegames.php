<?php
require 'scraper.php';

$livegames = getLiveGames();

setStartingEleven('2959076');

foreach ($livegames as $key => $value) {
	setGameEvents($value);
	setStartingEleven($value);
}

?>