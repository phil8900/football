<?php

require '../vendor/autoload.php';
//require_once 'livescore.php';
require 'scraper.php';

use Kreait\Firebase\Factory;
use Kreait\Firebase\ServiceAccount;

$serviceAccount = ServiceAccount::fromJsonFile(__DIR__ . '/../google-service-account.json');

$firebase = (new Factory)
	->withServiceAccount($serviceAccount)
	->withDatabaseUri('https://football-362b6.firebaseio.com')
	->create();

$database = $firebase->getDatabase();

$database->getReference('teams')->set($competitionteams);

echo json_encode($competitionfixtures);

$database->getReference('fixtures')->set($competitionfixtures);
//$newPost = $database->getReference('games/current')->set($current_games);

?>