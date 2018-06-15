function initRanking(){
	document.getElementById('rankingbutton').src = 'img/ranking_select.svg';
	initReferences();
	tutorialRankings();

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

	userRef.once('value', function(snapshot) {
		var array = new Array();
		snapshot.forEach(function(child) {
				array.push(child.val());
			
		});

		array.sort(function(a, b){return b.points-a.points});
		userRanking = array;
		setTeamRanking(userRanking);
	});



updateTeamRanking(false);
}

function updateTeamRanking(profile){
	teamRef.once('value', function(snapshot) {
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

			if(!isFinite(points)){
				points = 0;
			}

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

	div.classList.add('userelementranking');
	var firstlinediv = document.createElement('div');
	firstlinediv.classList.add('firstlinediv');

	var imagewrapper = document.createElement('span');
	imagewrapper.classList.add('rankinglogowrapper');
	firstlinediv.appendChild(imagewrapper);

	var image = document.createElement('img');
	if(entry.photoURL == 'null?type=large'){
		entry.photoURL = 'https://upload.wikimedia.org/wikipedia/commons/f/f4/Nelson_Neves_picuture.gif';
	}
	image.src = entry.photoURL; //AQUI CARALHO
	image.classList.add('rankinglogo');
	imagewrapper.appendChild(image);

	firebase.database().ref('/teams/' + entry['team'] + '/information').once('value', function(snapshot) {
		
		if(snapshot.val() != null){
			var teamimage = document.createElement('img');

			teamimage.src = snapshot.val()['teamlogo']; //AQUI CARALHO
			teamimage.classList.add('rankinglogo');
			imagewrapper.appendChild(teamimage);
		}
	});


	var namespan = document.createElement('span');
	namespan.appendChild(document.createTextNode(entry.name));
	namespan.classList.add('userrankingnameranking');

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
	pointsdiv.appendChild(document.createTextNode(Math.round(entry.points)+ ' pts'));
	pointsdiv.classList.add('userrankingpointsrankings');

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

	div.classList.add('userelementranking');
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
	namespan.classList.add('teamrankingnamerankings');

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

	var usercount = 0;

	firebase.database().ref('/rankings/users').once('value', function(snapshot) {
		snapshot.forEach(function(child){
			if(child.val()['team'] == entry['teamid']){
				usercount++;
			}

		});
		var pointsdiv = document.createElement('div');
		var teampoints = Math.round(entry.points/usercount);
		if(!isFinite(teampoints)){
			teampoints = 0;
		}
		pointsdiv.appendChild(document.createTextNode(teampoints));
		pointsdiv.classList.add('userrankingpointsrankings');
		div.appendChild(pointsdiv);

		document.getElementById(id).appendChild(div);
		});
}

function showTeamRanking(entry, profile){
	firebase.database().ref('/teams/' + entry.teamid + '/information').once('value', function(snapshot) {
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
	var ownteamranking = document.getElementById('ownteamranking');
	if(ownteamranking != null){
		document.getElementById('ownteamranking').innerHTML = '';
		var bootstrapcontainer = document.createElement('div');
		bootstrapcontainer.classList.add('container');
		var wrapper = document.createElement('div');
		wrapper.classList.add('row');

		var imagewrapper = document.createElement('div');
		imagewrapper.classList.add('rankinglogowrapper');
		imagewrapper.classList.add('userprofile');
		imagewrapper.classList.add('col-xs-6');

		var linebehind = document.createElement('div');
		linebehind.classList.add('linebehind');

		imagewrapper.appendChild(linebehind);

		var rankdiv = document.createElement('div');
		rankdiv.id = 'rankdiv';
		rankdiv.classList.add('col-xs-3');

		var confederation = document.createElement('div');
		confederation.id = 'confederation';
		confederation.classList.add('col-xs-3');
		confederation.classList.add('teamteamlogo');

		bootstrapcontainer.appendChild(wrapper);

		var rankparagraph = document.createElement('a');

		var ranksymbol = document.createElement('i');
		ranksymbol.classList.add('fas');
		getTrend(entry, ranksymbol);

	//	rankparagraph.appendChild(ranksymbol);

		rankparagraph.appendChild(document.createTextNode(' ' + entry.rank.rank));
		rankparagraph.id = 'ownteamrank';
		rankparagraph.href = "ranking.php";

		var ranktext = document.createElement('p');
		ranktext.appendChild(document.createTextNode('Team Ranking'));
		ranktext.classList.add('ranktext');

		rankdiv.appendChild(ranktext);
		rankdiv.appendChild(rankparagraph);



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
		fanbasediv.id = 'fanbaselevel';

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
		getBarValueTeam();
	}
}

function showBarValueTeam(percentage){
	var bar = document.getElementById('fanbasebar');
	bar.style.width = percentage/100 + '%';

	var usercount = 0;
	firebase.database().ref('rankings/users/').once('value', function(snapshot){
		snapshot.forEach(function(child){

				if(child.val()['team'] == ownteam){
			usercount++;
		}
		});
	});
			bar.innerHTML = Math.round(percentage/usercount) + 'pts';



/*	if(bar.offsetWidth >= 100% + '%'){ 						IF YOU CAME HERE BECAUSE OF THE RADIUS OF THE BAR WHEN = 100%
		bar.style.borderBottomRightRadius = 15 + 'px';
		bar.style.borderTopRightRadius = 15 + 'px';
	}
	*/
}

function getBarValueTeam(){


			firebase.database().ref('/rankings/teams/' + ownteam + '/').once('value', function (snapshot){
				var totalpoints = snapshot.val()['points'];
				showBarValueTeam(totalpoints);
			});

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

function tutorialRankings() {
	var seenvoucher = JSON.parse(localStorage.getItem("seentutorialranking"));

	if (seenvoucher == null) {
		localStorage.setItem("seentutorialranking", true);
		$('#tutorial').fadeIn('slow');
		$('#tutorialcontent').fadeIn('slow');

	}
}
