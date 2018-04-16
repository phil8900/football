var userRef = firebase.database().ref('rankings/users/').orderByChild('points');
var userRanking;

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
}

function showOwnProfile(snapshotvalue, entry){
	console.log(entry);
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
	var activitytext;

	if(activity == 'checkin'){
		activitytext = 'Checked in at';
	}
	else if(activity == 'reaction'){
		activitytext = 'Reacted to';
	}
	else if(activity == 'starting'){
		activitytext = 'Suggested starting 11';
	}

	var wrapper = document.getElementById('activity');
	var div = document.createElement('div');
	div.classList.add('acitivitybox');

	var paragraph = document.createElement('p');
	var symbol = document.createElement('i');
	symbol.classList.add('fas');
	symbol.classList.add('activityicon');
	getActivityIcon(symbol, activity);
	paragraph.appendChild(symbol);
	div.appendChild(paragraph);
	var description = document.createElement('p');
	description.appendChild(document.createTextNode(activitytext));

	div.appendChild(description);


	wrapper.appendChild(div);
}

function getActivityIcon(activitysymbol, activity){
	var symbol;
	var color = 'gray';

	if(activity == 'checkin'){
		symbol = 'fa-compass';
	}
	else if(activity == 'reaction'){
		symbol = 'fa-comments';
	}
	else if(activity == 'starting'){
		symbol = 'fa-futbol';
	}

	activitysymbol.classList.add(symbol);
	activitysymbol.style.color = color;
}

function getLastActivities(){
	showActivityBox('checkin');
	showActivityBox('reaction');
	showActivityBox('starting');
}