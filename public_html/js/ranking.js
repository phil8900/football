var database = firebase.database();

var userRanking;
var teamRanking;
var ownteam = 0;
var uid;
var userRef = firebase.database().ref('rankings/users/').orderByChild('points');
var teamRef = firebase.database().ref('rankings/teams/').orderByChild('points');

firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		uid = user.uid;
	} else {
		uid = 'AwTsR03Y7LRpsRiz5RaCojUwhqy2';
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
});

function setTeamRanking(userRanking){
	var ranking = 0;
	userRanking.forEach(function(entry) {
    ranking += entry.points;
});
	firebase.database().ref('rankings/teams/' + ownteam).set({
    points: ranking,
    teamid:ownteam
  });
}