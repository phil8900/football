var database = firebase.database();
var fixturesRef = firebase.database().ref('fixtures/');

var fixtures = JSON.parse(localStorage.getItem("loudstand_fixtures"));
var ownteam = JSON.parse(localStorage.getItem("loudstand_ownteam"));
var ownprofile = true;
var nextgame;

function initMatch(){

	var gameid = getQueryVariable("gameid");

	var swiper = new Swiper('.swiper-container', {
		initialSlide: 1
	});

	var passeduid = getQueryVariable("id");
	if(passeduid){
		uid = passeduid;
		ownprofile = false;
	}
	getLiveGameEvents(gameid);
	displayVouchers();
}

function getFutureGames(){
	var date = Math.floor(Date.now() / 1000);
	var futuregames = [];
	fixtures.forEach(function(game) {
		if(game.timestamp > date){
			futuregames.push(game);
		}
	});
	nextgame = futuregames[0];
	return futuregames;
}

function getLiveGameEvents(gameid){
	var livegame = getLiveGame();
	if(livegame && !gameid){
		gameid = livegame.gameid;
		getStartingEleven(livegame);
	}
	firebase.database().ref('/fixtures/' + gameid + '/events/').on('value', function(snapshot) {
		snapshot.forEach(function(child) {
			var wrapper = document.getElementById(gameid);
			var eventwrapper = document.getElementById(child.val().eventId);
			if((wrapper == null) || (eventwrapper == null)){
				createWrappers(gameid, child.val().eventId);
				showEvents(child.val(), gameid);
			}
		});
	});
}

function getEventReaction(event_id){
	firebase.database().ref('/fixtures/').once('value').then(function(snapshot) {
		snapshot.forEach(function(child) {
			firebase.database().ref('/fixtures/' + child.val().gameid + '/events/' + event_id + '/reactions').on('value', function(snapshot) {
				if((snapshot.val() !== null)){
					var positive = 0;
					var negative = 0;
					if((snapshot.val().positive !== undefined) &&(snapshot.val().negative !== undefined)){
						positive = snapshot.val().positive;
						negative = snapshot.val().negative;
					}
					showEventReaction(child.val().gameid, event_id, {positive:positive, negative:negative});
				}
			});
		});
	});
}

function showEvents(event, gameid){
	var latestgameevent = document.getElementById("latestgameevent");


	var eventwrapper = document.getElementById(event.eventId);
	eventwrapper.classList.add('activitybox');

	var currentscore = document.getElementById("currentscore");
	currentscore.innerHTML = event.tore_h + ' : ' + event.tore_g;

	var score = document.createElement('div');
	var text = document.createTextNode(event.tore_h + ' : ' + event.tore_g);
	score.appendChild(text);
	score.classList.add('score');
	eventwrapper.insertBefore(score, eventwrapper.getElementsByClassName('gamereaction')[0]);

	var eventlist = document.createElement("div");
	eventlist.classList.add('eventlist');

	var minutespan = document.createElement("div");
	var clock = document.createElement('i');
	clock.classList.add('fas');
	clock.classList.add('fa-stopwatch');
	minutespan.appendChild(clock);
	var minute = document.createTextNode(' ' + event.minute);
	minutespan.appendChild(minute);
	minutespan.classList.add('minute');
	eventlist.appendChild(minutespan);

	var typespan = document.createElement("div");
	var icon = getIconForEventType(event.type, event.subtype);
	typespan.appendChild(icon);

	eventlist.appendChild(typespan);

	firebase.database().ref('/teams/' + event.verein_id + '/information').once('value', function(snapshot) {
		var teamname = event.verein_id;
		var teamlogo = '';
		if(snapshot.val() != null){
			teamname = snapshot.val().teamname;
			teamlogo = snapshot.val().teamlogo;
		}
		var vereinspan = document.createElement("div");
		var logo = document.createElement('img');
		logo.classList.add('eventteamlogo');
		logo.src = teamlogo;
		vereinspan.appendChild(logo);
		var verein = document.createTextNode(' ' + teamname);
		vereinspan.appendChild(verein);
		vereinspan.classList.add('verein');
		eventlist.appendChild(vereinspan);
		});

		getPlayerInfo(event.spieler_id_1, event, eventlist);

		if(event.type == 'wechsel'){
			getPlayerInfo(event.spieler_id_2, event, eventlist);
		}

	eventwrapper.insertBefore(eventlist, eventwrapper.getElementsByClassName('gamereaction')[0]);
	getEventReaction(event.eventId);

	latestgameevent.innerHTML = eventwrapper.innerHTML;
}

function getIconForEventType(type, subtype){
	var icon = document.createElement('i');
	icon.classList.add('fas');

	if(type == 'tor'){
		icon.classList.add('fa-futbol');
	}
	else if(type == 'karte'){
		icon.classList.add('fa-square');
		if(subtype == 'gelb'){
			icon.style.color = 'yellow';
		}
		else{
			icon.style.color = 'red';
		}
	}
	else if(type == 'wechsel'){
		icon.classList.add('fa-exchange-alt');
	}
	else if(type == 'auswechsel'){
		icon.classList.add('fa-arrow-left');
		icon.style.color = 'red';
	}
	else if(type == 'einwechsel'){
		icon.classList.add('fa-arrow-right');		
		icon.style.color = 'green';
	}
	return icon;
}

function getStartingEleven(livegame){
	firebase.database().ref('/fixtures/' + livegame.gameid + '/startingeleven').on('value', function(snapshot){
		displayPlayers('home', livegame.hometeamid, snapshot.val()[livegame.hometeamid], livegame.gameid);
		displayPlayers('away', livegame.awayteamid, snapshot.val()[livegame.awayteamid], livegame.gameid);
	});
}

function displayPlayers(elementid, teamid, starters, gameid){
	var bench = starters['bench'];
	var starting = starters['starting'];
	showStartingEleven(elementid, teamid, starting, true, gameid);
	showStartingEleven(elementid, teamid, bench, false, gameid);
}

function showStartingEleven(elementid, teamid, playerarray, startingeleven, gameid){
	var teamRef = firebase.database().ref('teams/' + teamid + '/squad');

	teamRef.once('value', function(snapshot){
		playerarray.forEach(function(child){
			var player = snapshot.val()[child];

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

	if(ownprofile){
		if(teamid == ownteam){
			var button = document.createElement('button');
    		button.classList.add('checkinbutton');
    		button.addEventListener("click", function(){
    			manageMvp(button.parentElement.id, gameid, button);
    		});
    		var symbol = document.createElement('i');
    		symbol.classList.add('fas');
    		symbol.classList.add('fa-trophy');
    		button.appendChild(symbol);

    		div.appendChild(button);
    	}
    }

    var insertid = 'bench';
    if(startingeleven){
    	insertid = getGeneralPosition(player['position']);
    }

    var squaddiv = document.getElementById('homesquad');

    if(elementid == 'away'){
    	squaddiv = document.getElementById('awaysquad');
    }

	squaddiv.getElementsByClassName(insertid)[0].appendChild(div);
			});
	setupMvpButtons(gameid);
	});
}

function setupMvpButtons(gameid){
	var startingRef = firebase.database().ref('startingeleven/users/' + uid + '/' + gameid + '/mvp');
    startingRef.on('value', function(snapshot){
   	var mvpset = false;

    if(snapshot.val() != null){
    	var div = document.getElementById(snapshot.val().playerid);
    	var button = div.getElementsByClassName('checkinbutton')[0];
    	button.style.color = 'red';
    	mvpset = true;
    }

    		var all = document.getElementsByClassName('checkinbutton');
			for (var i = 0; i < all.length; i++) {
				if(mvpset){
 				 if(all[i].style.color != 'red'){
 				 	all[i].disabled = true;
 				 	all[i].style.color = 'lightgray';
 				 	}
 				 }
			else{
				 	all[i].disabled = false;
 				 	all[i].style.color = 'green';
			}
    	}
    	});
}

function manageMvp(playerid, gameid, button){
	var startingRef = firebase.database().ref('startingeleven/users/' + uid + '/' + gameid + '/mvp');

	startingRef.once('value', function(snapshot){
		if(snapshot.val() == null){
			var updates = {};
  			updates['startingeleven/users/' + uid + '/' + gameid + '/mvp/playerid'] = playerid;
  			updates['startingeleven/users/' + uid + '/' + gameid + '/mvp/timestamp'] = Math.floor(Date.now() / 1000);

  			firebase.database().ref().update(updates);

  			button.style.color = 'red';
		}
		else{
			firebase.database().ref('startingeleven/users/' + uid + '/' + gameid + '/mvp').remove();
			button.style.color = 'green';
		}
	})
}

function getPlayerInfo(playerid, event, eventlist){
	var eventwrapper = document.getElementById(event.eventId);
	var latestgameevent = document.getElementById("latestgameevent");
    var playername = playerid;

	firebase.database().ref('/teams/' + event.verein_id + '/squad/' + playerid).once('value', function(snapshot) {
		if(snapshot.val() != null){
			playername = snapshot.val().shortname;
			if(eventwrapper != null){
				eventwrapper.style.backgroundImage = "url('" + snapshot.val().picture + "')";
				latestgameevent.style.backgroundImage = "url('" + snapshot.val().picture + "')";
			}
		}
		var playerspan = document.createElement("div");

		if(event.type == 'wechsel'){
			if(playerid == event.spieler_id_1){
				playerspan.appendChild(getIconForEventType('auswechsel', null));
			}
			else{
				playerspan.appendChild(getIconForEventType('einwechsel', null));
			}
		}

		var player = document.createTextNode(' ' + playername);
		playerspan.appendChild(player);
		playerspan.classList.add('player');
		eventlist.appendChild(playerspan);
		//latestgameevent.getElementsByClassName("eventlist")[0].innerHTML = playerspan.innerHTML;
		//latestgameevent.appendChild(playerspan);

		latestgameevent.innerHTML = eventwrapper.innerHTML;
		
		});
}

function getTeamInfo(gameid, wrapper){
	if(wrapper == null){
		var wrapper = document.getElementById(gameid);
	}

	var score = document.getElementById("score");
	var location = document.getElementById("location");
	var time = document.getElementById("time");


	var gameheader = document.createElement("div");
	gameheader.id = 'gameheader';
	var homespan = document.createElement("span");
	homespan.classList.add('hometeam');
	gameheader.appendChild(homespan);
	var vs = document.createElement("span");
	vs.appendChild(document.createTextNode(' vs '));
	gameheader.appendChild(vs);
	var awayspan = document.createElement("span");
	awayspan.classList.add('awayteam');
	gameheader.appendChild(awayspan);

	score.appendChild(location);
	score.appendChild(gameheader);
	score.appendChild(time);

	var ref = firebase.database().ref('/fixtures/' + gameid).once('value', function(snapshot) {
		var hometeam = snapshot.val().hometeamid;
		homespan.id = hometeam;
		var awayteam = snapshot.val().awayteamid;
		awayspan.id = awayteam;
		var locationname = document.createTextNode(snapshot.val().location);
		location.appendChild(locationname);
		var matchtime = document.createTextNode(snapshot.val().time);
		time.appendChild(matchtime);


		var homename;
		var awayname;
		firebase.database().ref('/teams/' + hometeam + '/information').once('value', function(snapshot) {
			var home = document.createTextNode(snapshot.val().teamname);
			homespan.appendChild(home);
		});
		firebase.database().ref('/teams/' + awayteam + '/information').once('value', function(snapshot) {
			var away = document.createTextNode(snapshot.val().teamname);
			awayspan.appendChild(away);
		});
	});
}

function showEventReaction(game_id, event_id, reaction){
	var wrapper = document.getElementById(game_id);
	var eventwrapper = document.getElementById(event_id);
	var bar = eventwrapper.getElementsByClassName('reactionbar')[0];



	if(bar == null){
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
		bar = document.createElement('div');
		bar.classList.add('reactionbar');
		container.appendChild(bar);

		middle.appendChild(container);

		eventwrapper.getElementsByClassName('positive')[0].appendChild(row);
	}
	showReactionBarValue(bar, reaction);
}

function showReactionBarValue(reactionbar, reaction){
	var percentage;
	var positive = reaction.positive;
	var negative = reaction.negative;

	if((negative == 0) && (positive == 0)){
		percentage = 50;
	}
	else if(negative == 0){
		percentage = 100;
	}
	else{
		percentage = positive/negative;
	}

	reactionbar.style.width = percentage + '%';
	if(percentage == 100){
		reactionbar.style.borderTopRightRadius = '15px';
		reactionbar.style.borderBottomRightRadius = '15px';
	}
	else{
		reactionbar.style.borderTopRightRadius = '0px';
		reactionbar.style.borderBottomRightRadius = '0px';
	}
}

function createWrappers(game_id, event_id){
	var wrapper = document.getElementById(game_id);
	var eventwrapper = document.getElementById(event_id);

	if(wrapper == null){
		wrapper = document.createElement("div");
		wrapper.id = game_id;
		document.getElementById('events').appendChild(wrapper);
		getTeamInfo(game_id, null);
	}
	if(eventwrapper == null){
		eventwrapper = document.createElement("div");
		eventwrapper.id = event_id;
		eventwrapper.classList.add('eventbox');

		var reactiondiv = document.createElement('div');
		reactiondiv.classList.add('gamereaction');

		var positive = document.createElement('div');
		positive.classList.add('positive');
		var negative = document.createElement('div');
		negative.classList.add('negative');

		reactiondiv.appendChild(positive);
		reactiondiv.appendChild(negative);
		wrapper.appendChild(eventwrapper);

		var upbutton = document.createElement("button");
		var upsymbol = document.createElement('i');
		upsymbol.classList.add('fas');
		upsymbol.classList.add('fa-thumbs-up');
		upbutton.classList.add('upbutton');
		upbutton.appendChild(upsymbol);

		upbutton.addEventListener("click", function(){
    		reactToEvent(event_id, 1);
    		upbutton.disabled = true;
    		downbutton.disabled = true;
		}); 

		var downbutton = document.createElement("button");
		var downsymbol = document.createElement('i');
		downsymbol.classList.add('fas');
		downsymbol.classList.add('fa-thumbs-down');
		downbutton.appendChild(downsymbol);
		downbutton.classList.add('downbutton');

		downbutton.addEventListener("click", function(){
    		reactToEvent(event_id, -1);
    		downbutton.disabled = true;
    		upbutton.disabled = true;
		}); 

		reactiondiv.appendChild(upbutton);
		reactiondiv.appendChild(downbutton);
		eventwrapper.appendChild(reactiondiv);
	}
}

function reactToEvent(event_id, reaction){
		firebase.database().ref('/fixtures/').once('value').then(function(snapshot) {

		snapshot.forEach(function(child) {
			firebase.database().ref('/fixtures/' + child.key + '/events/' + event_id).once('value').then(function(snapshot) {
				if(snapshot.val() != null){
					var reactionRef = firebase.database().ref('/fixtures/' + child.key + '/events/' + event_id + '/reactions');
					var userReactionRef = firebase.database().ref('/fixtures/' + child.key + '/events/' + event_id + '/reactions/users/' + uid);

					userReactionRef.once('value').then(function(snapshot) {

					if(snapshot.val() == null){
						var currenttime = Math.floor(Date.now() / 1000);
						if(reaction == 1){
							reactionRef.child('positive').transaction(function(positive) {
							var updates = {};
  							updates['/fixtures/' + child.key + '/events/' + event_id + '/reactions/users/' + uid + '/reaction'] = 'positive';
  							updates['/fixtures/' + child.key + '/events/' + event_id + '/reactions/users/' + uid + '/timestamp'] = currenttime;


  							firebase.database().ref().update(updates);

							return positive + 1;
							});
						}
						else{
							reactionRef.child('negative').transaction(function(negative) {
								var updates = {};
  								updates['/fixtures/' + child.key + '/events/' + event_id + '/reactions/users/' + uid + '/reaction'] = 'negative';
  								updates['/fixtures/' + child.key + '/events/' + event_id + '/reactions/users/' + uid + '/timestamp'] = currenttime;

  								firebase.database().ref().update(updates);
								return negative + 1;
							});
						}
					}
				});
				}
			});
		});
	});
}

function displayVouchers(){
	firebase.database().ref('/partnerbars/placeids/').once('value').then(function(snapshot) {

		snapshot.forEach(function(child) {
			firebase.database().ref('/checkins/' + child.val() + '/' + uid).once('value').then(function(snapshot) {
				if (snapshot.val() != null) {
					console.log(snapshot.val());
					var voucher = document.createElement('div');
					voucher.id = 'voucher';
					voucher.innerHTML = 'VOUCHERS GO HERE';

					var opinion = document.createElement('div');
					opinion.id = '';
					opinion.innerHTML = 'OPINIONS GO HERE';


					var interactions = document.getElementById('interactions');
					interactions.appendChild(opinion);
					interactions.appendChild(voucher);


				}
			});
		});
	});
}