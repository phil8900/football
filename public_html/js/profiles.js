var userRef = firebase.database().ref('rankings/users/').orderByChild('points');
var userRanking;
var ownteam = JSON.parse(localStorage.getItem("loudstand_ownteam"));

function initProfiles(){
	document.getElementById('profilebutton').src = 'img/user_select.svg';

	userRef.on('value', function(snapshot) {
	var array = new Array();
	snapshot.forEach(function(child) {
		if(child.val().team == ownteam){
			array.push(child.val());
		}
	});

	array.sort(function(a, b){return b.points-a.points});
	userRanking = array;

	setUserProfile(userRanking);
});
	getLastActivities();
	updateTeamRanking(true);
	showSquad();
}

function showOwnProfile(snapshotvalue, entry){
	document.getElementById('ownprofile').innerHTML = '';
	var div = document.createElement('div');
	var imagewrapper = document.createElement('div');
	imagewrapper.classList.add('rankinglogowrapper');

	var rankdiv = document.createElement('div');
	rankdiv.id = 'rankdiv';
	var rankparagraph = document.createElement('p');

	var ranksymbol = document.createElement('i');
	ranksymbol.classList.add('fas');
	getTrend(entry, ranksymbol);

	rankparagraph.appendChild(ranksymbol);

	rankparagraph.appendChild(document.createTextNode(' ' + entry.rank));
	rankparagraph.id = 'ownteamrank';

	var ranktext = document.createElement('p');
	ranktext.appendChild(document.createTextNode('Fan ranking'));


	rankdiv.appendChild(rankparagraph);
	rankdiv.appendChild(ranktext);

	div.appendChild(rankdiv);

	var image = document.createElement('img');
	image.src = snapshotvalue['teamlogo'];
	image.classList.add('rankinglogo');
	imagewrapper.appendChild(image);

	div.appendChild(imagewrapper);

	var teamdiv = document.createElement('div');
	var teamparagraph = document.createElement('p');
	teamparagraph.appendChild(document.createTextNode(entry.name));
	var phraseparagraph = document.createElement('p');
	phraseparagraph.appendChild(document.createTextNode('This is a test of Loudstand'));
	phraseparagraph.id = 'phraseparagraph';
	teamdiv.id = 'ownteamname';
	teamdiv.appendChild(teamparagraph);

	div.appendChild(teamdiv);
	div.appendChild(phraseparagraph);

	var fanbasediv = document.createElement('div');
	var fanbaseparagraph = document.createElement('p');
	fanbaseparagraph.appendChild(document.createTextNode('Fandom Level'));
	fanbasediv.appendChild(fanbaseparagraph);
	fanbasediv.id = 'fanbase';

	var row = document.createElement('div');
	row.classList.add('row');
	var side = document.createElement('div');
	side.classList.add('side');
	row.appendChild(side);
	var middle = document.createElement('div');
	middle.classList.add('middle');
	row.appendChild(middle);

	var container = document.createElement('div');
	container.classList.add('bar-container');
	var bar = document.createElement('div');
	bar.id = 'fanbasebar';
	container.appendChild(bar);

	middle.appendChild(container);
	fanbasediv.appendChild(row);

	div.appendChild(fanbasediv);

	document.getElementById('ownprofile').appendChild(div);
	getBarValue();
}

function showBarValue(percentage){
	var bar = document.getElementById('fanbasebar');
	bar.style.width = percentage + '%';
	
	var fanbasediv = document.getElementById('fanbase');
	var rating = document.createElement('p');
	rating.appendChild(document.createTextNode(percentage/2/10 + '/5'));
	fanbasediv.appendChild(rating);
}

function getBarValue(){
	showBarValue(94);
}

function getTrend(entry, ranksymbol){
	var symbol = 'fa-caret-right';
	var color = 'gray';

	if(entry['rank'] != -1){
		if(entry['rank'] < entry['rank']['previous']){
			symbol = 'fa-caret-up';
			color = 'green';
		}
		else if(entry['rank'] > entry['rank']['previous']){
			symbol = 'fa-caret-down';
			color = 'red';
		}
	}

	ranksymbol.classList.add(symbol);
	ranksymbol.style.color = color;
}

function setUserProfile(userRanking){
	var rank = 1;
	document.getElementById('ownprofile').innerHTML = '';
	userRanking.forEach(function(entry) {
		if(entry['rank'] == null){
  			entry['previous'] = -1;
		}
		else{
			entry['previous'] = entry['rank']['rank'];
		}
		firebase.database().ref('rankings/users/' + entry.uid + '/rank').set({
    		rank: rank
  		});
		entry['rank'] = rank;
		rank++;
		if(entry.uid == uid){
			var teamRef = firebase.database().ref('teams/' + entry.team);
			teamRef.once('value', function(snapshot){
				showOwnProfile(snapshot.val()['information'], entry);
			});
			
		}
	});
}

function showActivityBox(activity){
	var wrapper = document.getElementById('activity');
	var div = document.createElement('div');
	div.classList.add('acitivitybox');

	var paragraph = document.createElement('p');
	var symbol = document.createElement('i');
	symbol.classList.add('fas');
	symbol.classList.add('activityicon');
	paragraph.appendChild(symbol);
	div.appendChild(paragraph);
	var description = document.createElement('p');
	getActivityIcon(symbol, activity, description);
	
	div.appendChild(description);
	wrapper.appendChild(div);
}

function displayUserProfile(){
	document.getElementById('userprofile').style.display = 'block';
	document.getElementById('teamprofile').style.display = 'none';
	document.getElementById('ownteamranking').style.display = 'block';
}

function displayTeamProfile(){
	document.getElementById('userprofile').style.display = 'none';
	document.getElementById('teamprofile').style.display = 'block';
	document.getElementById('ownteamranking').style.display = 'block';
}

function getActivityIcon(activitysymbol, activity, description){
	var symbol;
	var color = 'gray';
	var activitytext;

	if(activity == 'checkin'){
		symbol = 'fa-compass';
		activitytext = 'Checked in at';
	}
	else if(activity == 'reaction'){
		symbol = 'fa-comments';
		activitytext = 'Reacted to';
	}
	else if(activity == 'starting'){
		symbol = 'fa-futbol';
		activitytext = 'Suggested starting 11';
	}
	else if(activity == 'bestplayer'){
		symbol = 'fa-trophy';
		activitytext = 'Voted for MVP';
	}

	activitysymbol.classList.add(symbol);
	activitysymbol.style.color = color;
	description.appendChild(document.createTextNode(activitytext));
}

function getLastActivities(){
	showActivityBox('checkin');
	showActivityBox('reaction');
	showActivityBox('starting');
	showActivityBox('bestplayer');
}

function showSquad(){
	var teamRef = firebase.database().ref('teams/' + ownteam + '/squad');

	teamRef.once('value', function(snapshot){
		snapshot.forEach(function(child){
			var player = child.val();

	var div;
	if(document.getElementById(player['playerid']) == null){
		div = document.createElement('div');
		div.id = player['playerid'];
	}
	else{
		div = document.getElementById(player['playerid']);
		div.innerHTML = '';
	}

	div.classList.add('userelement');
	var firstlinediv = document.createElement('div');
	firstlinediv.classList.add('firstlinediv');

	var imagewrapper = document.createElement('div');
	imagewrapper.classList.add('playerimagewrapper');
	imagewrapper.style.backgroundImage="url('" + player['picture'] + "')";
	firstlinediv.appendChild(imagewrapper);

	var namespan = document.createElement('span');
	namespan.appendChild(document.createTextNode(player['fullname']));
	namespan.classList.add('userrankingname');

	firstlinediv.appendChild(namespan);

	var rankspan = document.createElement('span');
	rankspan.appendChild(document.createTextNode(player['status']));

	div.appendChild(firstlinediv);

	var pointsdiv = document.createElement('div');
	pointsdiv.appendChild(document.createTextNode(player['jerseynumber']));
	pointsdiv.classList.add('userrankingpoints');

	div.appendChild(pointsdiv);

	document.getElementById(getGeneralPosition(player['position'])).appendChild(div);
			});
	});
}

function getGeneralPosition(position){
	var general = 'keeper';

	var defenders = ["Left-Back", "Centre-Back", "Right-Back"];
	var midfielders = ["Attacking Midfield", "Central Midfield", "Defensive Midfield", "Left Midfield", "Right Midfield"];
	var strikers = ["Centre-Forward", "Left Wing", "Right Wing", "Secondary Striker"];

	if(defenders.includes(position)){
		general = 'defender';
	}
	else if(midfielders.includes(position)){
		general = 'midfielder';
	}
	else if(strikers.includes(position)){
		general = 'striker';
	}

	return general;
}