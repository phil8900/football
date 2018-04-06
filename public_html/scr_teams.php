<?php
require 'scraper.php';

//setGameEvents('2843952');

//getTeamFixtures('https://www.transfermarkt.co.uk/marokko/startseite/verein/3499');

$competition_url = 'https://www.transfermarkt.co.uk/premier-league/startseite/pokalwettbewerb/WM18';
scrapeTeams(getTeamURLsForCompetition($competition_url));

?>