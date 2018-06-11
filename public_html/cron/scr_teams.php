<?php
require 'scraper.php';

echo 'Started teamscraper';

$competition_url = 'https://www.transfermarkt.co.uk/premier-league/startseite/pokalwettbewerb/WM18';
scrapeTeams(getTeamURLsForCompetition($competition_url));

?>