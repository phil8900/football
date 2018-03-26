var database = firebase.database();

var userRanking;
var teamRanking;
var ownteam = 0;
var uid;
var userRef = firebase.database().ref('rankings/users/').orderByChild('points');
var teamRef = firebase.database().ref('rankings/teams/').orderByChild('points');
var fixturesRef = firebase.database().ref('fixtures/');

reactToEvent('401859415', 2);

firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		uid = user.uid;
	} else {
		uid = 'AwTsR03Y7LRpsRiz5RaCojUwhqy2'; //Test UID without logging in
	}
});

userRef.on('value', function(snapshot) {
	var array = new Array();
	snapshot.forEach(function(child) {
		if(child.val().uid == uid){
			ownteam = child.val().team;
		}
		if(child.val().team == ownteam){
			array.push(child.val());
		}
	});

	array.sort(function(a, b){return b.points-a.points});
	userRanking = array;
	setTeamRanking(userRanking);
});

teamRef.on('value', function(snapshot) {
	var array = new Array();
	snapshot.forEach(function(child) {
			array.push(child.val());
	});
	array.sort(function(a, b){return b.points-a.points});
	teamRanking = array;

	document.getElementById('teamranking').innerHTML = '';
	teamRanking.forEach(function(entry){
		createRankingElement(getTeamNameForId(entry.teamid) + " " + entry.points, 'teamranking');
	});
});

function setTeamRanking(userRanking){
	var ranking = 0;

	document.getElementById('userranking').innerHTML = '';
	userRanking.forEach(function(entry) {
	createRankingElement(entry.name + " " + entry.points, 'userranking');
    ranking += entry.points;
});
	firebase.database().ref('rankings/teams/' + ownteam).set({
    points: ranking,
    teamid:ownteam
  });
}

function createRankingElement(string, id){
	var node = document.createElement("LI");
	var textnode = document.createTextNode(string);
	node.appendChild(textnode);
	document.getElementById(id).appendChild(node);
}

function getTeamNameForId(id){
	return 'Test team';
}

function reactToEvent(event_id, reaction){
		firebase.database().ref('/fixtures/').once('value').then(function(snapshot) {

		snapshot.forEach(function(child) {
			firebase.database().ref('/fixtures/' + child.key + '/events/events/' + event_id).once('value').then(function(snapshot) {
				if(snapshot.val() != null){
					var reactionRef = firebase.database().ref('/fixtures/' + child.key + '/events/events/' + event_id + '/reactions');
					if(reaction == 1){
					reactionRef.child('positive').transaction(function(positive) {
						return positive + 1;
					});
					}
					else{
						reactionRef.child('negative').transaction(function(negative) {
							return negative + 1;
					});
					}
				}
			});
		});
	});
}