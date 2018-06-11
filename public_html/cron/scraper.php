<?php
require __DIR__ . '/../../vendor/autoload.php';
use JonnyW\PhantomJs\Client;
use Kreait\Firebase\Factory;
use Kreait\Firebase\ServiceAccount;

$serviceAccount = ServiceAccount::fromJsonFile(__DIR__ . '/../../google-service-account.json');

$firebase = (new Factory)
	->withServiceAccount($serviceAccount)
	->withDatabaseUri('https://football-362b6.firebaseio.com')
	->create();

$database = $firebase->getDatabase();

hQuery::$cache_path = __DIR__ . "/../cache";
hQuery::$cache_expires = 3600;

$prematch_base = 'https://www.transfermarkt.co.uk/spielbericht/index/spielbericht/';
$live_base = 'https://www.transfermarkt.co.uk/ticker/begegnung/live/';
$team_base = 'https://www.transfermarkt.co.uk/frankreich/startseite/verein/';

function getTeamURLsForCompetition($competition_url) {
	$table = getElementForSelector($competition_url, '#yw1');
	$teams = array();

	$teamrows = $table->find('.hauptlink a');

	foreach ($teamrows as $key => $value) {
		$teamurl = $value['href'];
		$team_id = $value['id'];
		$teams[$team_id] = $teamurl;
	}
	return $teams;
}

function scrapeTeams($teamurls) {
	$teams = array();
	global $database;
	foreach ($teamurls as $key => $value) {
		$teams[$key] = scrapeTeamURL($value);

		$updates = [
			'teams/' . $key . '/information/averageage' => $teams[$key]['information']['averageage'],
			'teams/' . $key . '/information/averagemarketvalue' => $teams[$key]['information']['averagemarketvalue'],
			'teams/' . $key . '/information/coach' => $teams[$key]['information']['coach'],
			'teams/' . $key . '/information/contintentaltitles' => $teams[$key]['information']['contintentaltitles'],
			'teams/' . $key . '/information/internationaltitles' => $teams[$key]['information']['internationaltitles'],
			'teams/' . $key . '/information/ranking' => $teams[$key]['information']['ranking'],
			'teams/' . $key . '/information/teamname' => $teams[$key]['information']['teamname'],
			'teams/' . $key . '/squad' => $teams[$key]['squad'],
			'teams/' . $key . '/information/news/' => $teams[$key]['information']['news'],
			'teams/' . $key . '/information/teamlogo' => $teams[$key]['information']['teamlogo'],
		];

		$database->getReference()->update($updates);

		foreach ($teams[$key]['information']['fixtures'] as $keyinner => $value) {
			$reference = $database->getReference('teams/' . $key . '/information/fixtures/' . $keyinner);
			$snapshot = $reference->getValue();

			if (!isset($snapshot)) {
				$reference->set($value);
			}
		}
	}
	return $teams;
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

	if ($table == null) {
		return getAlternativeTeamInformation($teamurl);
	}

	$teamname = trim(strip_tags($table->find('.spielername-profil')));

	$teamtable = $table->find('.profilheader tr td');
	$teamtableheaders = $table->find('.profilheader tr th');

	$counter = 0;
	$international_titles = '';
	$continental_titles = '';

	foreach ($teamtableheaders as $key => $value) {
		if ($value == 'Average age:') {
			$average_age = trim($teamtable[$counter]);
		} else if (strpos($value, 'Market value') !== false) {
			$average_marketvalue = trim($teamtable[$counter]);
		} else if ($value == 'FIFA world ranking:') {
			$ranking = trim(str_replace('no. ', '', strip_tags($teamtable[$counter])));
		} else if ($value == 'Intercontinental title:') {
			$international_titles = str_replace('&nbsp;', ' ', trim(strip_tags($teamtable[$counter])));
		} else if ($value == 'Continental title:') {
			$continental_titles = str_replace('&nbsp;', ' ', trim(strip_tags($teamtable[$counter])));
		}
		$counter++;
	}

	$coachtable = getElementForSelector($teamurl, '.mitarbeiterVereinSlider .container-inhalt');

	if ($coachtable != null) {
		$coach_name = $coachtable->find('.container-hauptinfo a')['title'];
		$coach_additionalinfos = $coachtable->find('.container-zusatzinfo')[0];
		$coach_age = applyRegExp('/(\d+)( Years)/', $coach_additionalinfos[0])[1];
		$coach_nationality = $coach_additionalinfos->find('.flaggenrahmen')['title'];
		$coach_since = applyRegExp('/(\w{3}\s{1}\d+,\s{1}\d{4})/', $coach_additionalinfos[0])[1];

		$coach = array('coachname' => (string) $coach_name, 'coachage' => (string) $coach_age, 'coachnationality' => $coach_nationality, 'coachsince' => $coach_since);
	} else {
		$coach = array('coachname' => 'No coach', 'coachage' => '', 'coachnationality' => '', 'coachsince' => '');

	}

	$teaminformation = array('teamname' => (string) $teamname, 'teamlogo' => getWikiImage($teamname), 'coach' => $coach, 'averageage' => (string) $average_age, 'averagemarketvalue' => (string) $average_marketvalue, 'internationaltitles' => (string) $international_titles, 'contintentaltitles' => (string) $continental_titles, 'ranking' => (string) $ranking, 'fixtures' => getTeamFixtures($teamurl), 'news' => getTeamNews($teamurl));

	return $teaminformation;
}

function getAlternativeTeamInformation($teamurl) {
	$sel = '.dataHeader.dataExtended.nationalmannschaft.wm18';
	$table = getElementForSelector($teamurl, $sel);

	$teamname = trim($table->find('.dataMain .dataTop .dataName b'));

	$coachtable = getElementForSelector($teamurl, '.mitarbeiterVereinSlider .container-inhalt');

	if ($coachtable != null) {
		$coach_name = $coachtable->find('.container-hauptinfo a')['title'];
		$coach_additionalinfos = $coachtable->find('.container-zusatzinfo')[0];
		$coach_age = applyRegExp('/(\d+)( Years)/', $coach_additionalinfos[0])[1];
		$coach_nationality = $coach_additionalinfos->find('.flaggenrahmen')['title'];
		$coach_since = applyRegExp('/(\w{3}\s{1}\d+,\s{1}\d{4})/', $coach_additionalinfos[0])[1];

		$coach = array('coachname' => (string) $coach_name, 'coachage' => (string) $coach_age, 'coachnationality' => $coach_nationality, 'coachsince' => $coach_since);
	} else {
		$coach = array('coachname' => 'No coach', 'coachage' => '', 'coachnationality' => '', 'coachsince' => '');

	}

	$average_marketvalue = 'Not available';

	$detailtable = $table->find('.dataContent .dataDaten .dataValue');

	$average_age = trim(preg_replace('/\s+/', ' ', $detailtable[1]));
	$ranking = trim(str_replace('Pos ', '', strip_tags($detailtable[4])));
	$international_titles = 'Not available';
	$continental_titles = 'Not available';

	$teaminformation = array('teamname' => (string) $teamname, 'teamlogo' => getWikiImage($teamname), 'coach' => $coach, 'averageage' => (string) $average_age, 'averagemarketvalue' => (string) $average_marketvalue, 'internationaltitles' => (string) $international_titles, 'contintentaltitles' => (string) $continental_titles, 'ranking' => (string) $ranking, 'fixtures' => getTeamFixtures($teamurl), 'news' => getTeamNews($teamurl));

	return $teaminformation;
}

function getTeamFixtures($teamurl) {
	$fixtures = array();
	$table = getElementForSelector($teamurl, '#begegnungenVereinSlider');

	foreach ($table->find('li') as $key => $value) {
		$game_id = applyRegExp("/\/(\d+)$/", $value['data-src'])[1];
		$fixtures[$game_id] = $game_id;

		global $database;
		$info = getPregameInformation($game_id);

		$updates = [
			'fixtures/' . $game_id . '/awayteamid' => $info['awayteamid'],
			'fixtures/' . $game_id . '/date' => $info['date'],
			'fixtures/' . $game_id . '/gameid' => $info['gameid'],
			'fixtures/' . $game_id . '/hometeamid' => $info['hometeamid'],
			'fixtures/' . $game_id . '/location' => $info['location'],
			'fixtures/' . $game_id . '/time' => $info['time'],
			'fixtures/' . $game_id . '/timestamp' => $info['timestamp'],
		];

		$database->getReference()->update($updates);
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
		$market_tmp = applyRegExp('/£.*?m|.*?k/', strip_tags($row->find('.rechts.hauptlink')[1]));
		if (count($market_tmp) == 0) {
			$market_value = 'N/A';
		} else {
			$market_value = $market_tmp[0];
		}

		$player_row = $row->find('.hide-for-small a');
		$player_id = $player_row['id'];
		$playerlink = $player_row['href'];
		$birthday = $row->find('.zentriert')[1];

		if ($row->find('.verletzt-table') != '') {
			$status = 'INJURED';
		}

		$player = array();

		$player = array('playerid' => (string) $player_id, 'playerlink' => (string) $playerlink, 'jerseynumber' => (string) $jersey_number, 'fullname' => (string) $full_name, 'shortname' => (string) $short_name, 'picture' => getWikiImage($full_name), 'position' => (string) $position, 'club' => (string) $club, 'status' => (string) $status, 'marketvalue' => (string) $market_value, 'birthday' => (string) $birthday);

		$squad[$player_id] = $player;
	}
	return $squad;
}

function setGameEvents($game_id) {
	global $database;
	$gameevents = getGameEvents($game_id)['events']['events'];

	foreach ($gameevents as $key => $value) {

		$reference = $database->getReference('fixtures/' . $game_id . '/events/' . $key);
		$snapshot = $reference->getValue();

		$value = (array) $value;
		$value['reactions']['positive'] = 0;
		$value['reactions']['negative'] = 0;
		$value['stars']['one'] = 0;
		$value['stars']['two'] = 0;
		$value['stars']['three'] = 0;
		$value['stars']['four'] = 0;
		$value['stars']['five'] = 0;

		if (!isset($snapshot)) {
			$reference->set($value);
		}
	}
	$gamereference = $database->getReference('fixtures/' . $game_id . '/minute');
	$gamesnapshot = $gamereference->getValue();

	$gamereference->set(getCurrentMinute($game_id));
}

function getCurrentMinute($gameid) {
	global $live_base;
	$liveurl = $live_base . $gameid;
	$client = Client::getInstance();

	if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
		$client->getEngine()->setPath(dirname(__FILE__) . '/../../bin/phantomjs.exe');
	} else {
		$client->getEngine()->setPath(dirname(__FILE__) . '/../../bin/phantomjs');
	}

	$request = $client->getMessageFactory()->createRequest($liveurl, 'GET');
	$response = $client->getMessageFactory()->createResponse();
	$client->send($request, $response);

	if ($response->getStatus() === 200) {

		$doc = hQuery::fromHTML($response->getContent());

		if ($doc->find('.live-spielminute-header') != '') {
			return strip_tags(str_replace('Minute ', '', $doc->find('.live-spielminute-header')));
		}
		return 'notlive';
	}
}

function getLiveGames() {
	global $database;
	$reference = $database->getReference('fixtures/');
	$snapshot = $reference->getValue();
	$date = time();
	$livegames = array();

	foreach ($snapshot as $key => $value) {
		if (($value['timestamp'] > $date - 9000) && ($value['timestamp'] < $date + 5400)) {
			array_push($livegames, $value['gameid']);
		}
	}
	return $livegames;
}

function getPregameInformation($game_id) {
	global $prematch_base;
	$pregameurl = $prematch_base . $game_id;

	$table = getElementForSelector($pregameurl, '#main');

	$header = $table->find('.sb-spielbericht-head');
	$hometeam_id = $header->find('.sb-heim a')['id'];
	$awayteam_id = $header->find('.sb-gast a')['id'];
	$game_infos = $header->find('.sb-spieldaten');
	$timearray = explode('|', $header->find('.sb-datum')[0]);
	$date = str_replace('&nbsp;', '', trim(strip_tags($timearray[1])));
	$time = str_replace('&nbsp;', '', trim($timearray[2]));
	$location = $header->find('.sb-zusatzinfos a')[0];

	$timestamp = DateTime::createFromFormat('  D, M d, Y g:i A', $date . ' ' . $time)->getTimeStamp();

	$timestamp = $timestamp + 3600;

	$pregameinfo = array('gameid' => (string) $game_id, 'hometeamid' => (string) $hometeam_id, 'awayteamid' => (string) $awayteam_id, 'date' => (string) $date, 'time' => (string) $time, 'location' => (string) $location, 'timestamp' => (string) $timestamp);

	return $pregameinfo;
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
		$client->getEngine()->setPath(dirname(__FILE__) . '/../../bin/phantomjs.exe');
	} else {
		$client->getEngine()->setPath('../../bin/phantomjs');
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

function setStartingEleven($gameid) {
	global $live_base;
	$liveurl = $live_base . $gameid;

	global $database;
	$reference = $database->getReference('fixtures/' . $gameid . '/startingeleven');
	$snapshot = $reference->getValue();

	$reference->set(getStartingEleven($liveurl));
}

function getTeamNews($teamurl) {
	$table = getElementForSelector($teamurl, '.relevante-news-auflistung ul li');
	$teamnews = array();

	if (isset($table)) {
		foreach ($table as $key => $value) {
			$date = (string) $value->find('span');
			$timestamp = DateTime::createFromFormat('M d, Y, h:i a', $date)->getTimeStamp();

			$newsitem = array('date' => $date, 'timestamp' => $timestamp, 'title' => (string) $value->find('a'), 'url' => (string) $value->find('a')['href']);
			array_push($teamnews, $newsitem);
		}
	}
	return $teamnews;
}

function getWikiImage($title) {
	$url = 'https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&generator=prefixsearch&formatversion=2&piprop=thumbnail&pithumbsize=450&pilimit=20&gpslimit=1&gpssearch=' . str_replace(' ', '%20', $title);

	$doc = hQuery::fromUrl($url, array('Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8', 'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:58.0) Gecko/20100101 Firefox/58.0'));

	$doc = (array) json_decode($doc);
	if (!isset($doc['query'])) {
		return 'https://upload.wikimedia.org/wikipedia/commons/f/f4/Nelson_Neves_picuture.gif';
	}

	$doc = (array) $doc['query'];
	$doc = (array) $doc['pages'][0];

	if (isset($doc['thumbnail'])) {
		$doc = (array) $doc['thumbnail'];
		return $doc['source'];
	}
	return 'https://upload.wikimedia.org/wikipedia/commons/f/f4/Nelson_Neves_picuture.gif';
}

function getGameEvents($game_id) {
	global $live_base;
	$url = str_replace('begegnung', 'getSpielverlauf', $live_base) . $game_id;
	$client = Client::getInstance();

	if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
		$client->getEngine()->setPath(dirname(__FILE__) . '/../../bin/phantomjs.exe');
	} else {
		$client->getEngine()->setPath('../../bin/phantomjs');
	}

	$request = $client->getMessageFactory()->createRequest($url, 'GET');
	$response = $client->getMessageFactory()->createResponse();
	$client->send($request, $response);

	if ($response->getStatus() === 200) {

		$doc = hQuery::fromHTML($response->getContent());

		$events = (array) (trim(strip_tags($doc)));

		$returnevents = [];

		$returnevents['gameid'] = $game_id;
		$returnevents['events'] = (array) json_decode($events[0]);

		return $returnevents;
	}
}

function buildArray($possession, $totalshots, $shotstarget, $shots, $saves, $corners, $freekicks, $fouls, $offside) {
	return array('possession' => (string) $possession, 'totalshots' => (string) $totalshots, 'shotstarget' => (string) $shotstarget, 'shots' => (string) $shots, 'saves' => (string) $saves, 'corners' => (string) $corners, 'freekicks' => (string) $freekicks, 'fouls' => (string) $fouls, 'offside' => (string) $offside);
}

function getGameStats($game_id) {
	$url = 'https://www.transfermarkt.co.uk/ticker/statistik/live/' . $game_id;
	$client = Client::getInstance();

	if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
		$client->getEngine()->setPath(dirname(__FILE__) . '/../../bin/phantomjs.exe');
	} else {
		$client->getEngine()->setPath('../../bin/phantomjs');
	}

	$request = $client->getMessageFactory()->createRequest($url, 'GET');
	$response = $client->getMessageFactory()->createResponse();
	$client->send($request, $response);

	if ($response->getStatus() === 200) {

		$doc = hQuery::fromHTML($response->getContent());

		$stats = $doc->find('#lt-statistik');

		if ($stats == null) {
			return getAlternativeStats($game_id);
		} else {
			$home = $stats->find('.sb-statistik-heim .sb-statistik-zahl');
			$away = $stats->find('.sb-statistik-gast .sb-statistik-zahl');
		}

		$homearray = buildArray($home[0], $home[1], $home[2], $home[3], $home[4], $home[5], $home[6], $home[7], $home[8]);
		$awayarray = buildArray($away[0], $away[1], $away[2], $away[3], $away[4], $away[5], $away[6], $away[7], $away[8]);

		$gamestats = array('home' => $homearray, 'away' => $awayarray);

		return $gamestats;

	}
}

function getAlternativeStats($game_id) {
	$url = 'https://www.transfermarkt.co.uk/spielbericht/statistik/spielbericht/' . $game_id;
	$client = Client::getInstance();

	if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
		$client->getEngine()->setPath(dirname(__FILE__) . '/../../bin/phantomjs.exe');
	} else {
		$client->getEngine()->setPath('../../bin/phantomjs');
	}

	$request = $client->getMessageFactory()->createRequest($url, 'GET');
	$response = $client->getMessageFactory()->createResponse();
	$client->send($request, $response);

	if ($response->getStatus() === 200) {

		$doc = hQuery::fromHTML($response->getContent());

		$home = $doc->find('.sb-statistik-heim .sb-statistik-zahl');
		$away = $doc->find('.sb-statistik-gast .sb-statistik-zahl');

		$possession = $doc->find('.sb-st-ballbesitz tspan');

		$awaypossession = $possession[1];
		$homepossession = $possession[2];

		$homearray = buildArray($homepossession, $home[0], $home[1], $home[2], $home[3], $home[4], $home[5], $home[6], $home[7]);
		$awayarray = buildArray($awaypossession, $away[0], $away[1], $away[2], $away[3], $away[4], $away[5], $away[6], $away[7]);

		$gamestats = array('home' => $homearray, 'away' => $awayarray);

		return $gamestats;
	}
}

function setGameStats($game_id) {
	global $database;

	$reference = $database->getReference('fixtures/' . $game_id . '/stats');
	$snapshot = $reference->getValue();

	$value = getGameStats($game_id);

	$reference->set($value);
}

?>