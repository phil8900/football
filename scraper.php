<?php

require_once 'node_modules/hquery.php/hquery.php';

hQuery::$cache_path = "node_modules/hquery.php/cache";
//hQuery::$cache_expires = 3600;

$url = 'https://www.transfermarkt.co.uk/frankreich/startseite/verein/3377';
//$url = 'https://www.transfermarkt.co.uk/tottenham-hotspur/startseite/verein/148';
$url = 'https://www.transfermarkt.co.uk/premier-league/startseite/pokalwettbewerb/WM18';

echo scrapeTeams(getTeamURLsForCompetition($url));

function getTeamURLsForCompetition($url) {
	$base_url = 'http://www.transfermarkt.co.uk';
	$table = getElementForSelector($url, '#yw1');
	$teams = array();

	$teamrows = $table->find('.hauptlink');

	foreach ($teamrows as $key => $value) {
		$teamurl = ($base_url . applyRegExp('/<a.*?href="(.*?)".*>/', $value)[1]);
		$team_id = applyRegExp('/<a.*?id="(.*?)".*>/', $value)[1];
		$teams[$team_id] = $teamurl;
	}
	return $teams;
}

function scrapeTeams($teamurls) {
	$teams = array();
	foreach ($teamurls as $key => $value) {
		$teams[$key] = scrapeTeamURL($value);
	}
	return json_encode($teams);
}

function scrapeTeamURL($url) {
	$team = array();
	$team['information'] = getTeamInformation($url);
	$team['squad'] = getPlayersForTeam($url);

	return $team;
}

function getPlayersForTeam($url) {
	$sel = '#yw1';
	$table = getElementForSelector($url, $sel);

	return getPlayerDetails($table);
}

function getTeamInformation($url) {
	$sel = '#verein_head';
	$table = getElementForSelector($url, $sel);

	$teamname = trim(strip_tags($table->find('.spielername-profil')));

	$teamtable = $table->find('.profilheader tr td');
	$average_age = trim($teamtable[2]);
	$average_marketvalue = trim($teamtable[4]);
	$international_titles = trim(strip_tags($teamtable[5]));
	$continental_titles = trim(strip_tags($teamtable[6]));
	$ranking = trim(str_replace('no. ', '', strip_tags($teamtable[7])));

	$teaminformation = array('teamname' => (string) $teamname, 'averageage' => (string) $average_age, 'averagemarketvalue' => (string) $average_marketvalue, 'internationaltitles' => (string) $international_titles, 'contintentaltitles' => (string) $continental_titles, 'ranking' => (string) $ranking);

	return $teaminformation;
}

function getElementForSelector($url, $sel) {
	if ($url && $sel) {
		try {
			$doc = hQuery::fromUrl($url, array('Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8', 'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:58.0) Gecko/20100101 Firefox/58.0'));

			return $doc->find($sel);

		} catch (Exception $ex) {
			$this->error_msg($ex);
			return false;
		}
	}
}

function applyRegExp($regex, $string) {
	$match = array();
	preg_match($regex, $string, $match);

	if (empty($match)) {
		array_push($match, 'N/A');
		array_push($match, 'Free Agent');
	}

	return $match;
}

function getPlayerDetails($table) {
	$base_url = 'http://www.transfermarkt.co.uk';
	$rows = $table->find('.odd, .even');
	$squad = array();

	foreach ($rows as $row) {
		$jersey_number = $row->find('.rn_nummer');
		$full_name = $row->find('.hide-for-small a');
		$short_name = $row->find('.show-for-small a');
		$position = $row->find('.inline-table td')[2];
		$status = 'FIT';
		$club = applyRegExp('/<img.*?alt="(.*?)".*>/', $row->find('.vereinprofil_tooltip'))[1];
		$market_value = applyRegExp('/£.*?m|.*?k/', strip_tags($row->find('.rechts.hauptlink')[1]))[0];

		$player_row = $row->find('.hide-for-small');
		$player_id = applyRegExp('/<a.*?id="(.*?)".*>/', $player_row)[1];
		$playerlink = $base_url . applyRegExp('/<a.*?href="(.*?)".*>/', $player_row)[1];
		$birthday = $row->find('.zentriert')[1];

		if ($row->find('.verletzt-table') != '') {
			$status = 'INJURED';
		}

		$player = array();

		$player = array('playerid' => (string) $player_id, 'playerlink' => (string) $playerlink, 'jerseynumber' => (string) $jersey_number, 'fullname' => (string) $full_name, 'shortname' => (string) $short_name, 'position' => (string) $position, 'club' => (string) $club, 'status' => (string) $status, 'marketvalue' => (string) $market_value, 'birthday' => (string) $birthday);

		$squad[$player_id] = $player;
	}
	return $squad;
}

?>