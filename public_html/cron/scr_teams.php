<?php
require 'scraper.php';

echo 'Started teamscraper';

$competition_url = 'https://www.transfermarkt.co.uk/weltmeisterschaft-2018/teilnehmer/pokalwettbewerb/WM18/saison_id/2017';
scrapeTeams(getTeamURLsForCompetition($competition_url));

?>