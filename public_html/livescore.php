<?php
ini_set('max_execution_time', 300);
$ini = parse_ini_file('../config.ini'); // Will parse the contents of the ini file in the array

$livescore_api_key = $ini['LIVESCORE_API_KEY'];
$livescore_api_secret = $ini['LIVESCORE_API_SECRET'];

$league_id = 227;

$fixtures = file_get_contents('http://livescore-api.com/api-client/fixtures/matches.json?key=' . $livescore_api_key . '&secret=' . $livescore_api_secret . '&league=' . $league_id);

$livescores = file_get_contents('http://livescore-api.com/api-client/scores/live.json?key=' . $livescore_api_key . '&secret=' . $livescore_api_secret . '&league=' . $league_id);

$decoded_fixtures = json_decode($fixtures);
$decoded_livescores = json_decode($livescores);

$upcoming_games = $decoded_fixtures->data->fixtures;
$current_games = $decoded_livescores->data->match;

foreach ($current_games as $match) {
	$liveevents = file_get_contents(str_replace('amp;', '', $match->events));
	$decoded_liveevents = json_decode($liveevents);
	$match->events = $decoded_liveevents->data->event;
}
?>