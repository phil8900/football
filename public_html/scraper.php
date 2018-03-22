<?php
require '../vendor/autoload.php';
use JonnyW\PhantomJs\Client;

hQuery::$cache_path = "../cache";
//hQuery::$cache_expires = 3600;

$url = 'https://www.transfermarkt.co.uk/frankreich/startseite/verein/3377';
//$url = 'https://www.transfermarkt.co.uk/tottenham-hotspur/startseite/verein/148';
$competition_url = 'https://www.transfermarkt.co.uk/premier-league/startseite/pokalwettbewerb/WM18';

$gameurl = 'https://www.transfermarkt.co.uk/ticker/begegnung/live/3018417';

$testurl = 'https://www.transfermarkt.co.uk/ticker/begegnung/live/2871933';

$prematchurl = 'https://www.transfermarkt.co.uk/spielbericht/index/spielbericht/2991905';

getStartingEleven($testurl);

function getTeamURLsForCompetition($competition_url) {
	$base_url = 'http://www.transfermarkt.co.uk';
	$table = getElementForSelector($competition_url, '#yw1');
	$teams = array();

	$teamrows = $table->find('.hauptlink a');

	foreach ($teamrows as $key => $value) {
		$teamurl = $base_url . $value['href'];
		$team_id = $value['id'];
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

function scrapeTeamURL($teamurl) {
	$team = array();
	$team['information'] = getTeamInformation($teamurl);
	$team['squad'] = getPlayersForTeam($teamurl);

	return $team;
}

function getPlayersForTeam($teamurl) {
	$sel = '#yw1';
	$table = getElementForSelector($teamurl, $sel);

	return getPlayerDetails($table);
}

function getTeamInformation($teamurl) {
	$sel = '#verein_head';
	$table = getElementForSelector($teamurl, $sel);

	$teamname = trim(strip_tags($table->find('.spielername-profil')));

	$teamtable = $table->find('.profilheader tr td');
	$average_age = trim($teamtable[2]);
	$average_marketvalue = trim($teamtable[4]);
	$international_titles = trim(strip_tags($teamtable[5]));
	$continental_titles = trim(strip_tags($teamtable[6]));
	$ranking = trim(str_replace('no. ', '', strip_tags($teamtable[7])));

	$coachtable = getElementForSelector($teamurl, '.mitarbeiterVereinSlider .container-inhalt');
	$coach_name = $coachtable->find('.container-hauptinfo a')['title'];
	$coach_additionalinfos = $coachtable->find('.container-zusatzinfo')[0];
	$coach_age = applyRegExp('/(\d+)( Years)/', $coach_additionalinfos[0])[1];
	$coach_nationality = $coach_additionalinfos->find('.flaggenrahmen')['title'];
	$coach_since = applyRegExp('/(\w{3}\s{1}\d+,\s{1}\d{4})/', $coach_additionalinfos[0])[1];

	$coach = array('coachname' => (string) $coach_name, 'coachage' => (string) $coach_age, 'coachnationality' => $coach_nationality, 'coachsince' => $coach_since);

	$teaminformation = array('teamname' => (string) $teamname, 'coach' => $coach, 'averageage' => (string) $average_age, 'averagemarketvalue' => (string) $average_marketvalue, 'internationaltitles' => (string) $international_titles, 'contintentaltitles' => (string) $continental_titles, 'ranking' => (string) $ranking, 'fixtures' => getTeamFixtures($teamurl));

	return $teaminformation;
}

function getTeamFixtures($teamurl) {
	$fixtures = array();
	$table = getElementForSelector($teamurl, '#begegnungenVereinSlider');

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
		$club = $row->find('.vereinprofil_tooltip img')['alt'];
		$market_value = applyRegExp('/£.*?m|.*?k/', strip_tags($row->find('.rechts.hauptlink')[1]))[0];

		$player_row = $row->find('.hide-for-small a');
		$player_id = $player_row['id'];
		$playerlink = $base_url . $player_row['href'];
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

function getGameEvents($liveurl) {
	$url = str_replace('begegnung', 'getSpielverlauf', $liveurl);

	$doc = hQuery::fromUrl($url, array('Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8', 'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:58.0) Gecko/20100101 Firefox/58.0'));

	return $doc;
}

function getPregameInformation($pregameurl) {
	$table = getElementForSelector($pregameurl, '#main');

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
}

function fillPlayerArray($players) {
	$lineup = array();
	foreach ($players as $key => $value) {
		array_push($lineup, (string) $value[0]['id']);
	}
	return $lineup;
}

function createLineupArray($starting, $bench) {
	$lineup = array();
	$lineup['starting'] = fillPlayerArray($starting);
	$lineup['bench'] = fillPlayerArray($bench);

	return $lineup;
}

function getStartingEleven($liveurl) {
	$client = Client::getInstance();

	if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
		$client->getEngine()->setPath(dirname(__FILE__) . '/../bin/phantomjs.exe');
	} else {
		$client->getEngine()->setPath('../bin/phantomjs');
	}

	$request = $client->getMessageFactory()->createRequest($liveurl, 'GET');
	$response = $client->getMessageFactory()->createResponse();
	$client->send($request, $response);

	if ($response->getStatus() === 200) {
		$lineups = array();

		$doc = hQuery::fromHTML($response->getContent());

		$lineup_box = $doc->find('.aufstellung-box');
		$squads = $doc->find('#lt-formation');
		$clubs = $squads->find('.sb-vereinslink');
		$club_home = $clubs[0]['id'];
		$club_away = $clubs[1]['id'];
		$bench = $squads->find('.ersatzbank');

		//Backup version without lineup-box
		//$starting_home = $lineups[0]->find('tr');
		//$bench_home = $lineups[1]->find('tr');
		//$starting_away = $lineups[2]->find('tr');
		//$bench_away = $lineups[3]->find('tr');

		$bench_home = $bench[0]->find('a');
		$bench_away = $bench[1]->find('a');

		$starting_home = $lineup_box[0]->find('.aufstellung-rueckennummer-box');
		$starting_away = $lineup_box[1]->find('.aufstellung-rueckennummer-box');

		$lineup_home = createLineupArray($starting_home, $bench_home);
		$lineup_away = createLineupArray($starting_away, $bench_away);

		$lineups[$club_home] = $lineup_home;
		$lineups[$club_away] = $lineup_away;

		return $lineups;
	}
	return false;
}
?>