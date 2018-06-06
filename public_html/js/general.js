var ownteam = 0;
var fixtures;
var uid;

setOwnTeam();

function setOwnTeam(){

var userRef = firebase.database().ref('rankings/users/').orderByChild('points');
firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		uid = user.uid;
		localStorage.setItem("loudstand_uid", user.uid);
	} else {
		uid = 'AwTsR03Y7LRpsRiz5RaCojUwhqy2'; //Test UID without logging in
	}
	userRef.on('value', function(snapshot) {
	snapshot.forEach(function(child) {
		if(child.val().uid == uid){
			ownteam = child.val().team;
			getFixtureIdsForOwnTeam();
		}
	});
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
		if((game.timestamp > (date-9000)) && (game.timestamp < (date+3600))){
			livegame = game;
		}
	});
	return livegame;
}

function saveFixtures(fixturearray){
	localStorage.setItem("loudstand_ownteam", ownteam);
	localStorage.setItem("loudstand_fixtures", JSON.stringify(fixturearray));
}

function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}

function getPointsTable(interactiontype){
	firebase.database().ref('pointstable/').once('value', function(snapshot){
			var interactionpoints = snapshot.val()[interactiontype];

			var reactionRef = firebase.database().ref('/rankings/users/' + uid);
		reactionRef.child('points').transaction(function(points) {
			var updates = {};

			return points + interactionpoints;
		});

	});
}