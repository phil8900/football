function initRanking(){
	document.getElementById('rankingbutton').src = 'img/ranking_select.svg';
	initReferences();
}

var userRanking;
var teamRanking;
var userRef = firebase.database().ref('rankings/users/').orderByChild('points');
var teamRef = firebase.database().ref('rankings/teams/').orderByChild('points');


function initReferences(){

	var swiper = new Swiper('.swiper-container', {
		initialSlide: 0
	});

	swiper.on('slideChange', function () {
		if (swiper.activeIndex == 0) {
			$(".right").css('background-color', '#0F281D');
			$(".left").css('background-color', '#2c7656');

		}

		if (swiper.activeIndex == 1) {
			$(".left").css('background-color', '#0F281D');
			$(".right").css('background-color', '#2c7656');
		}

	});

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

updateTeamRanking(false);
}

function updateTeamRanking(profile){
	teamRef.on('value', function(snapshot) {
	var array = new Array();
	snapshot.forEach(function(child) {
			array.push(child.val());
	});
	array.sort(function(a, b){return b.points-a.points});
	teamRanking = array;

	if(!profile){
		document.getElementById('teamranking').innerHTML = '';
	}
	var rank = 1;
	teamRanking.forEach(function(entry){

		if(entry['rank']['rank'] == null){
  			entry['rank']['previous'] = -1;
		}
		else{
			entry['rank']['previous'] = entry['rank']['rank'];
		}
		entry['rank']['rank'] = rank;

		var storedrank;
		var storedprevious;
		var rankRef = firebase.database().ref('rankings/teams/' + entry.teamid + '/rank');
		rankRef.once('value', function(snapshot){
			storedrank = snapshot.val()['rank'];
			storeprevious = snapshot.val()['previous'];
		});
		
		if(entry['rank']['previous'] != rank){
			if(entry.points != 0){
				if((storedrank != rank) || (storeprevious != entry['rank']['previous'])){
					rankRef.set({
						rank: rank,
						previous: entry['rank']['previous']
					});
				}
			}
  		}
		showTeamRanking(entry, profile);
		rank++;
	});
});
}

function setTeamRanking(userRanking){
	var rank = 1;
	document.getElementById('userranking').innerHTML = '';
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
		createUserRankingElement(entry, 'userranking');
		rank++;
	});
	getPointsForTeams();
}

function getPointsForTeams(){
	teamRef.once('value', function(snapshot) {
		snapshot.forEach(function(child) {
			var teamid = child.val().teamid;
			var points = 0;
			
			userRef.on('value', function(snapshot) {
				snapshot.forEach(function(child) {
					if(teamid == child.val().team){
						points += child.val().points;
					}
				});
			});

			if(child.val().points != points){
			var updates = {};

			updates['rankings/teams/' + teamid + '/points'] = points;
			updates['rankings/teams/' + teamid + '/teamid'] = teamid;
			firebase.database().ref().update(updates);
			}
		});
	});
}

function createUserRankingElement(entry, id){
	var link = document.createElement('a');
	link.href = 'profiles.php?id=' + entry['uid'];
	var div;
	if(document.getElementById(entry['uid']) == null){
		div = document.createElement('div');
		div.id = entry['uid'];
	}
	else{
		div = document.getElementById(entry['uid']);
		div.innerHTML = '';
	}

	div.classList.add('userelement');
	var firstlinediv = document.createElement('div');
	firstlinediv.classList.add('firstlinediv');
	var namespan = document.createElement('span');
	namespan.appendChild(document.createTextNode(entry.name));
	namespan.classList.add('userrankingname');

	firstlinediv.appendChild(namespan);

	var rankspan = document.createElement('span');
	rankspan.appendChild(document.createTextNode(entry.rank + ' '));
	var ranksymbol = document.createElement('i');
	ranksymbol.classList.add('fas');
	getTrend(entry, ranksymbol);
	rankspan.appendChild(ranksymbol);
	rankspan.classList.add('userranking');

	firstlinediv.appendChild(rankspan);
	div.appendChild(firstlinediv);

	var pointsdiv = document.createElement('div');
	pointsdiv.appendChild(document.createTextNode(entry.points));
	pointsdiv.classList.add('userrankingpoints');

	div.appendChild(pointsdiv);
	link.appendChild(div);

	document.getElementById(id).appendChild(link);
}

function createTeamRankingElement(snapshotvalue, entry, id){
	var div;
	if(document.getElementById(entry['teamid']) == null){
		div = document.createElement('div');
		div.id = entry['teamid'];
	}
	else{
		div = document.getElementById(entry['teamid']);
		div.innerHTML = '';
	}

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
	rankspan.appendChild(document.createTextNode(entry.rank.rank + ' '));
	var ranksymbol = document.createElement('i');
	ranksymbol.classList.add('fas');
	getTrend(entry, ranksymbol);
	rankspan.appendChild(ranksymbol);
	rankspan.classList.add('userranking');

	firstlinediv.appendChild(rankspan);
	div.appendChild(firstlinediv);

	var pointsdiv = document.createElement('div');
	pointsdiv.appendChild(document.createTextNode(entry.points));
	pointsdiv.classList.add('userrankingpoints');

	div.appendChild(pointsdiv);

	document.getElementById(id).appendChild(div);
}

function showTeamRanking(entry, profile){
	firebase.database().ref('/teams/' + entry.teamid + '/information').on('value', function(snapshot) {
		if(ownteam == entry.teamid && profile){
			showOwnTeam(snapshot.val(), entry);
		}
		if(!profile){
			createTeamRankingElement(snapshot.val(), entry, 'teamranking');
		}
	});
}

function displayUserRanking(){
	var swiper = new Swiper('.swiper-container', {
		initialSlide: 1
	});

	$(".right").css('background-color', '#0F281D');
	$(".left").css('background-color', '#2c7656');

	swiper.slidePrev();
}

function displayTeamRanking(){
	var swiper = new Swiper('.swiper-container', {
		initialSlide: 0
	});

	$(".left").css('background-color', '#0F281D');
	$(".right").css('background-color', '#2c7656');

	swiper.slideNext();
}

function showOwnTeam(snapshotvalue, entry){
	document.getElementById('ownteamranking').innerHTML = '';
	var bootstrapcontainer = document.createElement('div');
	bootstrapcontainer.classList.add('container');
	var wrapper = document.createElement('div');
	wrapper.classList.add('row');

	var imagewrapper = document.createElement('div');
	imagewrapper.classList.add('rankinglogowrapper');
	imagewrapper.classList.add('teamteamlogo');
	imagewrapper.classList.add('col-xs-4');

	var rankdiv = document.createElement('div');
	rankdiv.id = 'rankdiv';
	rankdiv.classList.add('col-xs-4');

	var confederation = document.createElement('div');
	confederation.id = 'confederation';
	confederation.classList.add('col-xs-4');
	confederation.classList.add('teamteamlogo');

	bootstrapcontainer.appendChild(wrapper);

	var rankparagraph = document.createElement('p');

	var ranksymbol = document.createElement('i');
	ranksymbol.classList.add('fas');
	getTrend(entry, ranksymbol);

	rankparagraph.appendChild(ranksymbol);

	rankparagraph.appendChild(document.createTextNode(' ' + entry.rank.rank));
	rankparagraph.id = 'ownteamrank';

	var ranktext = document.createElement('p');
	ranktext.appendChild(document.createTextNode('team ranking'));

	rankdiv.appendChild(rankparagraph);
	rankdiv.appendChild(ranktext);


	var image = document.createElement('img');
	image.src = snapshotvalue['teamlogo'];
	imagewrapper.appendChild(image);

	var confederationimage = document.createElement('img');
	confederationimage.src = snapshotvalue['confederation'];
	confederation.appendChild(confederationimage);

	wrapper.appendChild(rankdiv);
	wrapper.appendChild(imagewrapper);
	wrapper.appendChild(confederation);


	var teamdiv = document.createElement('div');
	var teamparagraph = document.createElement('p');
	teamparagraph.appendChild(document.createTextNode(snapshotvalue['teamname']));
	teamdiv.id = 'ownteamname';
	teamdiv.appendChild(teamparagraph);

	bootstrapcontainer.appendChild(teamdiv);

	var fanbasediv = document.createElement('div');
	var fanbaseparagraph = document.createElement('p');
	fanbaseparagraph.appendChild(document.createTextNode('FANBASE LEVEL'));
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

	bootstrapcontainer.appendChild(fanbasediv);

	document.getElementById('ownteamranking').appendChild(bootstrapcontainer);
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

	if(entry['rank']['previous'] != -1){
		if(entry['rank']['rank'] < entry['rank']['previous']){
			symbol = 'fa-caret-up';
			color = 'green';
		}
		else if(entry['rank']['rank'] > entry['rank']['previous']){
			symbol = 'fa-caret-down';
			color = 'red';
		}
	}

	ranksymbol.classList.add(symbol);
	ranksymbol.style.color = color;
}