var userRanking;
var teamRanking;
var userRef = firebase.database().ref('rankings/users/').orderByChild('points');
var teamRef = firebase.database().ref('rankings/teams/').orderByChild('points');

userRef.on('value', function(snapshot) {
	var array = new Array();
	snapshot.forEach(function(child) {
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
		showTeamRanking(entry);
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

function showTeamRanking(entry){
	firebase.database().ref('/teams/' + entry.teamid + '/information/teamname').on('value', function(snapshot) {
		createRankingElement(snapshot.val() + " " + entry.points, 'teamranking');
	});
}