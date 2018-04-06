<?php
require 'scraper.php';

$livegames = getLiveGames();

foreach ($livegames as $key => $value) {
	setGameEvents($value);
}

?>