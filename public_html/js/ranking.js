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
	var rank = 1;
	teamRanking.forEach(function(entry){
		entry['rank'] = rank;
		showTeamRanking(entry);
		rank++;
	});
});

function setTeamRanking(userRanking){
	var ranking = 0;
	var rank = 1;

	document.getElementById('userranking').innerHTML = '';
	userRanking.forEach(function(entry) {
	entry['rank'] = rank;
	createUserRankingElement(entry, 'userranking');
    ranking += entry.points;
    rank++;
});
	firebase.database().ref('rankings/teams/' + ownteam).set({
    points: ranking,
    teamid:ownteam
  });
}

function createUserRankingElement(entry, id){
	var div = document.createElement('div');
	div.classList.add('userelement');
	var firstlinediv = document.createElement('div');
	firstlinediv.classList.add('firstlinediv');
	var namespan = document.createElement('span');
	namespan.appendChild(document.createTextNode(entry.name));
	namespan.classList.add('userrankingname');

	firstlinediv.appendChild(namespan);

	var rankspan = document.createElement('span');
	rankspan.appendChild(document.createTextNode(entry.rank));
	rankspan.classList.add('userranking');

	firstlinediv.appendChild(rankspan);
	div.appendChild(firstlinediv);

	var pointsdiv = document.createElement('div');
	pointsdiv.appendChild(document.createTextNode(entry.points));
	pointsdiv.classList.add('userrankingpoints');

	div.appendChild(pointsdiv);

	document.getElementById(id).appendChild(div);
}

function createTeamRankingElement(snapshotvalue, entry, id){
	var div = document.createElement('div');
	div.classList.add('userelement');
	var firstlinediv = document.createElement('div');
	firstlinediv.classList.add('firstlinediv');

	var imagewrapper = document.createElement('span');
	imagewrapper.classList.add('rankinglogowrapper');
	firstlinediv.appendChild(imagewrapper);

	var image = document.createElement('img');
	image.src = snapshotvalue['teamlogo'];
	image.classList.add('rankinglogo');
	imagewrapper.appendChild(image);

	var namespan = document.createElement('span');
	namespan.appendChild(document.createTextNode(snapshotvalue['teamname']));
	namespan.classList.add('userrankingname');

	firstlinediv.appendChild(namespan);

	var rankspan = document.createElement('span');
	rankspan.appendChild(document.createTextNode(entry.rank));
	rankspan.classList.add('userranking');

	firstlinediv.appendChild(rankspan);
	div.appendChild(firstlinediv);

	var pointsdiv = document.createElement('div');
	pointsdiv.appendChild(document.createTextNode(entry.points));
	pointsdiv.classList.add('userrankingpoints');

	div.appendChild(pointsdiv);

	document.getElementById(id).appendChild(div);
}

function showTeamRanking(entry){
	firebase.database().ref('/teams/' + entry.teamid + '/information').on('value', function(snapshot) {
		createTeamRankingElement(snapshot.val(), entry, 'teamranking');
	});
}

function displayUserRanking(){
	document.getElementById('userranking').style.display = 'block';
	document.getElementById('teamranking').style.display = 'none';
}

function displayTeamRanking(){
	document.getElementById('userranking').style.display = 'none';
	document.getElementById('teamranking').style.display = 'block';
}