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
			fixtureids.forEach(function(id) {
			array.push(snapshot.child(id).val());
		});
		saveFixtures(array);
	});
}

function saveFixtures(fixturearray){
	localStorage.setItem("loudstand_ownteam", ownteam);
	localStorage.setItem("loudstand_fixtures", JSON.stringify(fixturearray));
}