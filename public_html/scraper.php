<?php

//require_once 'node_modules/hquery.php/hquery.php';
require '../vendor/autoload.php';
use JonnyW\PhantomJs\Client;

hQuery::$cache_path = "../cache";
//hQuery::$cache_expires = 3600;

$url = 'https://www.transfermarkt.co.uk/frankreich/startseite/verein/3377';
//$url = 'https://www.transfermarkt.co.uk/tottenham-hotspur/startseite/verein/148';
//$url = 'https://www.transfermarkt.co.uk/premier-league/startseite/pokalwettbewerb/WM18';

$gameurl = 'https://www.transfermarkt.co.uk/ticker/begegnung/live/3018417';

$testurl = 'https://www.transfermarkt.co.uk/ticker/begegnung/live/2871933';

$prematchurl = 'https://www.transfermarkt.co.uk/spielbericht/index/spielbericht/2991905';

getPregameInformation($prematchurl);

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

	$teaminformation = array('teamname' => (string) $teamname, 'averageage' => (string) $average_age, 'averagemarketvalue' => (string) $average_marketvalue, 'internationaltitles' => (string) $international_titles, 'contintentaltitles' => (string) $continental_titles, 'ranking' => (string) $ranking, 'fixtures' => getTeamFixtures($url));

	echo json_encode($teaminformation);

	return $teaminformation;
}

function getTeamFixtures($url) {
	$fixtures = array();
	$table = getElementForSelector($url, '#begegnungenVereinSlider');

	foreach ($table->find('li') as $key => $value) {
		array_push($fixtures, applyRegExp("/\/(\d+)$/", $value['data-src'])[1]);
	}

	return $fixtures;
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

function getGameEvents($url) {
	$url = str_replace('begegnung', 'getSpielverlauf', $url);

	$doc = hQuery::fromUrl($url, array('Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8', 'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:58.0) Gecko/20100101 Firefox/58.0'));

	return $doc;
}

function getPregameInformation($url) {
	$table = getElementForSelector($url, '#main');

	$header = $table->find('.sb-spielbericht-head');
	$hometeam_id = $header->find('.sb-heim a')['id'];
	$awayteam_id = $header->find('.sb-gast a')['id'];
	$game_infos = $header->find('.sb-spieldaten');
	$timearray = explode('|', $header->find('.sb-datum')[0]);
	$date = $timearray[1];
	$time = $timearray[2];
	$location = $header->find('.sb-zusatzinfos a');

	$factstable = $table->find('.zentriert');
	$previous_games = array();

	for ($i = 1; $i <= count($factstable); $i++) {
		echo $factstable[$i];
		echo '<br>';
		echo $i;
		echo '<br>';
	}

	//echo $factstable;
}

function fillPlayerArray($players) {
	$lineup = array();
	foreach ($players as $key => $value) {
		array_push($lineup, (string) applyRegExp('/<a.*?id="(.*?)".*>/', $value[0])[1]);
	}
	return $lineup;
}

function fillPlayerArrayDiv($players) {
	$lineup = array();
	foreach ($players as $key => $value) {
		array_push($lineup, (string) applyRegExp('/<div.*?id="(.*?)".*>/', $value[0])[1]);
	}
	return $lineup;
}

function createLineupArray($starting, $bench) {
	$lineup = array();
	$lineup['starting'] = fillPlayerArrayDiv($starting);
	$lineup['bench'] = fillPlayerArray($bench);

	return $lineup;
}

function getStartingEleven($url) {
	$client = Client::getInstance();
	//$client->getEngine()->setPath('/bin/phantomjs');
	$client->getEngine()->setPath(dirname(__FILE__) . '/bin/phantomjs.exe');

	$request = $client->getMessageFactory()->createRequest($url, 'GET');
	$response = $client->getMessageFactory()->createResponse();
	$client->send($request, $response);

	if ($response->getStatus() === 200) {
		$doc = hQuery::fromHTML($response->getContent());

		$lineup_box = $doc->find('.aufstellung-box');
		$squads = $doc->find('#lt-formation');
		$clubs = $squads->find('.sb-vereinslink');
		$club_home = $clubs[0];
		$club_away = $clubs[1];
		$bench = $squads->find('.ersatzbank');

		//Backup version without lineup-box
		//$starting_home = $lineups[0]->find('tr');
		//$bench_home = $lineups[1]->find('tr');
		//$starting_away = $lineups[2]->find('tr');
		//$bench_away = $lineups[3]->find('tr');

		$bench_home = $bench[0]->find('tr');
		$bench_away = $bench[1]->find('tr');

		$starting_home = $lineup_box[0]->find('.aufstellung-spieler-container');
		$starting_away = $lineup_box[1]->find('.aufstellung-spieler-container');

		$lineup_home = createLineupArray($starting_home, $bench_home);
		$lineup_away = createLineupArray($starting_away, $bench_away);
	}
}
?>