var ownteam = 0;
var fixtures;
var uid;

setOwnTeam();

function setOwnTeam(){
var userRef = firebase.database().ref('rankings/users/').orderByChild('points');
firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		uid = user.uid;
	} else {
		uid = 'AwTsR03Y7LRpsRiz5RaCojUwhqy2'; //Test UID without logging in
	}
});

userRef.on('value', function(snapshot) {
	snapshot.forEach(function(child) {
		if(child.val().uid == uid){
			ownteam = child.val().team;
			getFixtureIdsForOwnTeam();
		}
	});
});
}

function getFixtureIdsForOwnTeam(){
	var teamsRef = firebase.database().ref('teams/' + ownteam + '/information/fixtures');

	teamsRef.once('value').then(function(snapshot) {
		getFixturesForOwnTeam(snapshot.val());
	});
}

function getFixturesForOwnTeam(fixtureids){
	var array = [];
	var fixturesRef = firebase.database().ref('fixtures/');

	fixturesRef.once('value').then(function(snapshot) {
		for(var propt in fixtureids){
			array.push(snapshot.child(fixtureids[propt]).val());
		}
		saveFixtures(array);
	});
}

function getLiveGame(){
	var date = Math.floor(Date.now() / 1000);
	var livegame = false;

	fixtures.forEach(function(game) {
		if((game.timestamp > date-9000) && (game.timestamp < date+5400)){
			livegame = game;
		}
	});
	return livegame;
}

function saveFixtures(fixturearray){
	localStorage.setItem("loudstand_ownteam", ownteam);
	localStorage.setItem("loudstand_fixtures", JSON.stringify(fixturearray));
}