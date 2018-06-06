var database = firebase.database();

var fixtures = JSON.parse(localStorage.getItem("loudstand_fixtures"));
var ownteam = JSON.parse(localStorage.getItem("loudstand_ownteam"));
var ownprofile = true;
var nextgame;
var gameid;

function initMatch(){

	gameid = getQueryVariable("gameid");

	if(!gameid){
		gameid = '';
	}

	showSquad(gameid);

	var swiper = new Swiper('.swiper-container', {
		initialSlide: 1

	});

	var passeduid = getQueryVariable("id");
	if(passeduid){
		uid = passeduid;
		ownprofile = false;
	}

	getLiveGameEvents(gameid);
	hideFooter();


	var date = Math.floor((Date.now() / 1000))+7200;
	var livegame = getLiveGame();

	/*fixtures.forEach(function(child) {
	 console.log(child['timestamp'] < date);
	 if (livegame && gameid.timestamp < (date)){
	 {*/
	displayVouchers(false);



	displayStats(gameid);
	displayPostMatchEvents(gameid);
	$(".submitbutton").hide();
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
				createWrappers(gameid, child.val().eventId, child.val().type);
				showEvents(child.val(), gameid);
			}
		});
	});
}

function displayRatingStars(gameid, onebutton, twobutton, threebutton, fourbutton, fivebutton){
	firebase.database().ref('startingeleven/users/').once('value', function (snapshot) {
		var aggrating = 0;
		var counter = 0;
		snapshot.forEach(function(child){
			if(child.val()[gameid] != undefined){
			if(child.val()[gameid]['finalreview'] != null){
				aggrating = aggrating + child.val()[gameid]['finalreview']['finalreview'];
				counter++;
			}
			}
		});
		var starrating = Math.round(aggrating/counter);
			onebutton.disabled = true;
			twobutton.disabled = true;
			threebutton.disabled = true;
			fourbutton.disabled = true;
			fivebutton.disabled = true;

			if(starrating >= 1){
				onebutton.classList.add('checkedstar');
			}
			if(starrating >= 2){
				twobutton.classList.add('checkedstar');
			}
			if(starrating >= 3){
				threebutton.classList.add('checkedstar');
			}
			if(starrating >= 4){
				fourbutton.classList.add('checkedstar');
			}
			if(starrating >= 5){
				fivebutton.classList.add('checkedstar');
			}
	});
}


function displayAverageStars(event_id, onebutton, twobutton, threebutton, fourbutton, fivebutton){
	onebutton.disabled = true;
	twobutton.disabled = true;
	threebutton.disabled = true;
	fourbutton.disabled = true;
	fivebutton.disabled = true;
	firebase.database().ref('/fixtures/').once('value').then(function(snapshot) {
		snapshot.forEach(function(child) {
			firebase.database().ref('/fixtures/' + child.val().gameid + '/events/' + event_id + '/stars').on('value', function(snapshot) {
				if((snapshot.val() !== null)){
					var one = snapshot.val()['one'];
					var two = snapshot.val()['two'];
					var three = snapshot.val()['three'];
					var four = snapshot.val()['four'];
					var five = snapshot.val()['five'];
					var starrating = 0;

					var agg = one+two+three+four+five;

					if(agg > 0){
						starrating = (5*five + 4*four + 3*three + 2*two + one)/(five+four+three+two+one);
					}
					if(starrating >= 1){
						onebutton.classList.add('checkedstar');
					}
					if(starrating >= 2){
						twobutton.classList.add('checkedstar');
					}
					if(starrating >= 3){
						threebutton.classList.add('checkedstar');
					}
					if(starrating >= 4){
						fourbutton.classList.add('checkedstar');
					}
					if(starrating >= 5){
						fivebutton.classList.add('checkedstar');
					}
				}
			});
		});
	});
}

function displayButtonPercentages(event_id, upbutton, downbutton){
	firebase.database().ref('/fixtures/').once('value').then(function(snapshot) {
		snapshot.forEach(function(child) {
			firebase.database().ref('/fixtures/' + child.val().gameid + '/events/' + event_id + '/reactions').on('value', function(snapshot) {
				if((snapshot.val() !== null)){
					var positive = 0;
					var negative = 0;
					var percentage = 0;
					if((snapshot.val().positive !== undefined) &&(snapshot.val().negative !== undefined)){
						positive = snapshot.val().positive;
						negative = snapshot.val().negative;
					}
					if((negative+positive) > 0){
						percentage = (positive/(positive+negative))*100;
					}
					upbutton.innerHTML = percentage + '%';
					downbutton.innerHTML = 100-percentage + '%';
				}
			});
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

}

function getMvpList(){
	firebase.database().ref('/fixtures/' + gameid).once('value', function(snapshot){
		livegame = snapshot.val();
		firebase.database().ref('/fixtures/' + livegame.gameid + '/startingeleven').on('value', function(snapshot){
			displayPlayers('home', ownteam, snapshot.val()[ownteam], livegame.gameid);
		});
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
			if(player != undefined){

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

            var countspan = document.createElement('span');
            countspan.classList.add('mvpcountspan');
            countspan.innerHTML = 0;
            div.appendChild(countspan);

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


			if(squaddiv.getElementsByClassName(insertid)[0] != null){
				squaddiv.getElementsByClassName(insertid)[0].appendChild(div);
			}
			else{
				squaddiv.appendChild(div);
			}
			countGameMvpvotes(player['playerid']);
			}
		});
		setupMvpButtons(gameid);
		displayPostMatchEvents(gameid);
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
			$('#mvp .checkinbutton').hide();
		}

		var all = document.getElementsByClassName('checkinbutton');
		for (var i = 0; i < all.length; i++) {
			if(mvpset){
				if(all[i].style.color != 'red'){
					all[i].disabled = true;
				}
			}
			else{
				all[i].disabled = false;
				all[i].style.color = 'green';
			}
		}
	});
}

function displayMvpRanking(){
		var startingRef = firebase.database().ref('startingeleven/users/' + uid + '/' + gameid + '/mvp');
			startingRef.on('value', function(snapshot){

		if(snapshot.val() != null){
	$('.userelement:gt(2)').show();
    var players = $(".userelement");

    var orderedDivs = players.sort(function (a, b) {
        return ($(a).find('.mvpcountspan').html() > $(b).find('.mvpcountspan').html()) ? -1 : ($(a).find('.mvpcountspan').html() < $(b).find('.mvpcountspan').html()) ? 1 : 0;
    });

    $("#mvp #homesquad").html(orderedDivs);
    $('#mvp #homesquad .userelement:gt(2)').hide();
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
			getPointsTable('MVP');
		}
		else{
			//firebase.database().ref('startingeleven/users/' + uid + '/' + gameid + '/mvp').remove();
			$('#mvp .checkinbutton').hide();
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

		if(eventwrapper != undefined){
			latestgameevent.innerHTML = eventwrapper.innerHTML;
		}

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

	if(score != null){
		score.appendChild(location);
		score.appendChild(gameheader);
		score.appendChild(time);
	}

	var ref = firebase.database().ref('/fixtures/' + gameid).once('value', function(snapshot) {
		var hometeam = snapshot.val().hometeamid;
		homespan.id = hometeam;
		var awayteam = snapshot.val().awayteamid;
		awayspan.id = awayteam;
		var locationname = document.createTextNode(snapshot.val().location);
		if(location != null){
			location.appendChild(locationname);
		}

		if(snapshot.val()['minute'] != undefined){
			var minute = document.createElement('div');
			minute.id = 'gameminute';
			minute.appendChild(document.createTextNode(snapshot.val()['minute']));
			score.appendChild(minute);
		}
				
		var calcdate = new Date(snapshot.val().timestamp * 1000 + new Date().getTimezoneOffset() + 60000);
		var calctime = calcdate.toString("hh:mm tt");
		var matchtime = document.createTextNode(calctime);

		if(time != null){
			time.appendChild(matchtime);
		}

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
		percentage = (positive/(positive + negative))*100;
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

function createWrappers(game_id, event_id, event_type){

	var wrapper = document.getElementById(game_id);
	var eventwrapper = document.getElementById(event_id);

	if(wrapper == null){
		wrapper = document.createElement("div");
		wrapper.id = game_id;
		document.getElementById('events').appendChild(wrapper);
		getTeamInfo(game_id, null);
	}
	if(eventwrapper == null) {
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

		if(event_type != 'tor'){
			var upbutton = document.createElement("button");
			var upsymbol = document.createElement('i');
			upsymbol.classList.add('fas');
			upsymbol.classList.add('fa-thumbs-up');
			upbutton.classList.add('upbutton');
			upbutton.appendChild(upsymbol);

			var downbutton = document.createElement("button");
			var downsymbol = document.createElement('i');
			downsymbol.classList.add('fas');
			downsymbol.classList.add('fa-thumbs-down');
			downbutton.appendChild(downsymbol);
			downbutton.classList.add('downbutton');


			upbutton.addEventListener("click", function () {
				reactToEvent(event_id, 1);
				upbutton.disabled = true;
				downbutton.disabled = true;
				displayButtonPercentages(event_id, upbutton, downbutton);
			});


			downbutton.addEventListener("click", function () {
				reactToEvent(event_id, -1);
				downbutton.disabled = true;
				upbutton.disabled = true;
				displayButtonPercentages(event_id, upbutton, downbutton);
			});

			reactiondiv.appendChild(upbutton);
			reactiondiv.appendChild(downbutton);

			firebase.database().ref('/fixtures/' + game_id + '/events/' + event_id + '/reactions/users/' + uid).once('value').then(function(snapshot) {
				if(snapshot.val() != null){
					upbutton.disabled = true;
					downbutton.disabled = true;
					displayButtonPercentages(event_id, upbutton, downbutton);
				}
			});
		}
		else{
			var onesymbol = document.createElement('i');
			onesymbol.classList.add('fas');
			onesymbol.classList.add('fa-star');

			var twosymbol = document.createElement('i');
			twosymbol.classList.add('fas');
			twosymbol.classList.add('fa-star');

			var threesymbol = document.createElement('i');
			threesymbol.classList.add('fas');
			threesymbol.classList.add('fa-star');

			var foursymbol = document.createElement('i');
			foursymbol.classList.add('fas');
			foursymbol.classList.add('fa-star');

			var fivesymbol = document.createElement('i');
			fivesymbol.classList.add('fas');
			fivesymbol.classList.add('fa-star');

			var onebutton = document.createElement("button");
			onebutton.classList.add('onebutton');
			onebutton.appendChild(onesymbol);

			var twobutton = document.createElement("button");
			twobutton.appendChild(twosymbol);
			twobutton.classList.add('twobutton');

			var threebutton = document.createElement("button");
			threebutton.appendChild(threesymbol);
			threebutton.classList.add('threebutton');

			var fourbutton = document.createElement("button");
			fourbutton.appendChild(foursymbol);
			fourbutton.classList.add('fourbutton');

			var fivebutton = document.createElement("button");
			fivebutton.appendChild(fivesymbol);
			fivebutton.classList.add('fivebutton');

			onebutton.addEventListener("click", function () {
				rateStars(event_id, 'one');
				displayAverageStars(event_id, onebutton, twobutton, threebutton, fourbutton, fivebutton);

			});
			twobutton.addEventListener("click", function () {
				rateStars(event_id, 'two');
				displayAverageStars(event_id, onebutton, twobutton, threebutton, fourbutton, fivebutton);
			});
			threebutton.addEventListener("click", function () {
				rateStars(event_id, 'three');
				displayAverageStars(event_id, onebutton, twobutton, threebutton, fourbutton, fivebutton);
			});
			fourbutton.addEventListener("click", function () {
				rateStars(event_id, 'four');
				displayAverageStars(event_id, onebutton, twobutton, threebutton, fourbutton, fivebutton);
			});
			fivebutton.addEventListener("click", function () {
				rateStars(event_id, 'five');
				displayAverageStars(event_id, onebutton, twobutton, threebutton, fourbutton, fivebutton);
			});

			reactiondiv.appendChild(onebutton);
			reactiondiv.appendChild(twobutton);
			reactiondiv.appendChild(threebutton);
			reactiondiv.appendChild(fourbutton);
			reactiondiv.appendChild(fivebutton);

			firebase.database().ref('/fixtures/' + game_id + '/events/' + event_id + '/stars/users/' + uid).once('value').then(function(snapshot) {
				if(snapshot.val() != null){
					onebutton.disabled = true;
					twobutton.disabled = true;
					threebutton.disabled = true;
					fourbutton.disabled = true;
					fivebutton.disabled = true;
					displayAverageStars(event_id, onebutton, twobutton, threebutton, fourbutton, fivebutton);
				}
			});

		}
		eventwrapper.appendChild(reactiondiv);

		firebase.database().ref('/fixtures/' + game_id + '/events/' + event_id + '/').on('value', function(snapshot) {
			if(snapshot.val()['verein_id'] != ownteam){
				reactiondiv.style.visibility = 'hidden';
			}
		});

	}

}

function finalRateStars(gameid, reaction){
	firebase.database().ref('startingeleven/users/' + uid + '/' + gameid + '/finalreview').once('value', function (child) {
		if (child.val() == null) {
			firebase.database().ref('startingeleven/users/' + uid + '/' + gameid + '/finalreview').set({
				finalreview: reaction
			});
			getPointsTable('finalreview');
		}
	});
}


function rateStars(event_id, reaction){
	firebase.database().ref('/fixtures/').once('value').then(function(snapshot) {

		snapshot.forEach(function(child) {
			firebase.database().ref('/fixtures/' + child.key + '/events/' + event_id).once('value').then(function(snapshot) {
				if(snapshot.val() != null){
					var reactionRef = firebase.database().ref('/fixtures/' + child.key + '/events/' + event_id + '/stars');
					var userReactionRef = firebase.database().ref('/fixtures/' + child.key + '/events/' + event_id + '/stars/users/' + uid);

					getPointsTable(snapshot.val()['type']);

					userReactionRef.once('value').then(function(snapshot) {

						if(snapshot.val() == null){
							var currenttime = Math.floor(Date.now() / 1000);

							reactionRef.child(reaction).transaction(function(reaction) {
								var updates = {};
								updates['/fixtures/' + child.key + '/events/' + event_id + '/stars/users/' + uid + '/reaction'] = 'positive';
								updates['/fixtures/' + child.key + '/events/' + event_id + '/reactions/users/' + uid + '/timestamp'] = currenttime;


								firebase.database().ref().update(updates);

								return reaction + 1;
							});
						}
					});
				}
			});
		});
	});
}

function reactToEvent(event_id, reaction){
	firebase.database().ref('/fixtures/').once('value').then(function(snapshot) {

		snapshot.forEach(function(child) {
			firebase.database().ref('/fixtures/' + child.key + '/events/' + event_id).once('value').then(function(snapshot) {
				if(snapshot.val() != null){
					var reactionRef = firebase.database().ref('/fixtures/' + child.key + '/events/' + event_id + '/reactions');
					var userReactionRef = firebase.database().ref('/fixtures/' + child.key + '/events/' + event_id + '/reactions/users/' + uid);

					getPointsTable(snapshot.val()['type']);

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

function displayPostMatchEvents (gameid){
	var interactions = document.getElementById('interactions');
	var postmatchcontainer = document.getElementById('postmatchcontainer');

	var postmatchcontainertitle = document.getElementById('postmatchcontainertitle');

	if(postmatchcontainertitle == null){

		var MVP = document.createElement('div');
		MVP.classList.add('MVP');
		MVP.classList.add('col-xs-4');
		MVP.innerHTML = "MVP";
		MVP.addEventListener("click", function(){ displayMVP();});

		var submitmvp = document.createElement('button');
		submitmvp.classList.add('submitbutton');
		submitmvp.innerHTML = 'Submit!';

		var voteformvpcontent = document.createElement('div');
		voteformvpcontent.classList.add('postmatchvotecontent');
		voteformvpcontent.innerHTML = 'VOTE FOR MVP HERE';

		var voteformvp = document.getElementById("mvp");
		voteformvp.appendChild(voteformvpcontent);
		voteformvp.appendChild(submitmvp);

		var finalreview = document.createElement('div');
		finalreview.classList.add('finalreview');
		finalreview.innerHTML = "Final Review";
		finalreview.classList.add('col-xs-4');
		finalreview.addEventListener("click", function(){ displayFinalReview();});

		var submitfinalreview = document.createElement('button');
		submitfinalreview.classList.add('submitbutton');
		submitfinalreview.innerHTML = 'Submit!';

		var voteforfinalreviewcontent = document.createElement('div');
		voteforfinalreviewcontent.classList.add('postmatchvotecontent');

		var voteforfinalreview = document.createElement('div');
		voteforfinalreview.classList.add('postmatchvote');
		voteforfinalreview.id = 'finalreview';
		voteforfinalreview.appendChild(voteforfinalreviewcontent);
		voteforfinalreview.appendChild(submitfinalreview);

		var onesymbol = document.createElement('i');
		onesymbol.classList.add('fas');
		onesymbol.classList.add('fa-star');

		var twosymbol = document.createElement('i');
		twosymbol.classList.add('fas');
		twosymbol.classList.add('fa-star');

		var threesymbol = document.createElement('i');
		threesymbol.classList.add('fas');
		threesymbol.classList.add('fa-star');

		var foursymbol = document.createElement('i');
		foursymbol.classList.add('fas');
		foursymbol.classList.add('fa-star');

		var fivesymbol = document.createElement('i');
		fivesymbol.classList.add('fas');
		fivesymbol.classList.add('fa-star');

		var onebutton = document.createElement("button");
		onebutton.classList.add('onebutton');
		onebutton.appendChild(onesymbol);

		var twobutton = document.createElement("button");
		twobutton.appendChild(twosymbol);
		twobutton.classList.add('twobutton');

		var threebutton = document.createElement("button");
		threebutton.appendChild(threesymbol);
		threebutton.classList.add('threebutton');

		var fourbutton = document.createElement("button");
		fourbutton.appendChild(foursymbol);
		fourbutton.classList.add('fourbutton');

		var fivebutton = document.createElement("button");
		fivebutton.appendChild(fivesymbol);
		fivebutton.classList.add('fivebutton');

		displayRatingStars(gameid, onebutton, twobutton, threebutton, fourbutton, fivebutton);

		onebutton.addEventListener("click", function () {
			finalRateStars(gameid, 1);
			displayRatingStars(gameid, onebutton, twobutton, threebutton, fourbutton, fivebutton);
		});
		twobutton.addEventListener("click", function () {
			finalRateStars(gameid, 2);
			displayRatingStars(gameid, onebutton, twobutton, threebutton, fourbutton, fivebutton);
		});
		threebutton.addEventListener("click", function () {
			finalRateStars(gameid, 3);
			displayRatingStars(gameid, onebutton, twobutton, threebutton, fourbutton, fivebutton);
		});
		fourbutton.addEventListener("click", function () {
			finalRateStars(gameid, 4);
			displayRatingStars(gameid, onebutton, twobutton, threebutton, fourbutton, fivebutton);
		});
		fivebutton.addEventListener("click", function () {
			finalRateStars(gameid, 5);
			displayRatingStars(gameid, onebutton, twobutton, threebutton, fourbutton, fivebutton);
		});

		voteforfinalreviewcontent.appendChild(onebutton);
		voteforfinalreviewcontent.appendChild(twobutton);
		voteforfinalreviewcontent.appendChild(threebutton);
		voteforfinalreviewcontent.appendChild(fourbutton);
		voteforfinalreviewcontent.appendChild(fivebutton);

		var finalcomment = document.createElement('div');
		finalcomment.classList.add('finalcomment');
		finalcomment.innerHTML = "Final Comment";
		finalcomment.classList.add('col-xs-4');
		finalcomment.addEventListener("click", function(){ displayFinalComment();});

		var commentareacontent = document.createElement('input');
		commentareacontent.classList.add('postmatchvotecontent');
		commentareacontent.placeholder = 'YOUR OPINION GOES HERE...';

		var submitfinalcomment = document.createElement('button');
		submitfinalcomment.classList.add('submitbutton');
		submitfinalcomment.innerHTML = 'Submit!';

		submitfinalcomment.addEventListener("click", function() {
			firebase.database().ref('startingeleven/users/' + uid + '/' + gameid + '/finalcomment').once('value', function (child) {
				if (child.val() == null) {
					firebase.database().ref('startingeleven/users/' + uid + '/' + gameid + '/finalcomment').push({
						finalcomment: commentareacontent.value
					});
					getPointsTable('finalcomment');
				}
			});



		});


		var commentarea = document.createElement('div');
		commentarea.classList.add('postmatchvote');
		commentarea.id = 'finalcomment';
		commentarea.appendChild(commentareacontent);
		commentarea.appendChild(submitfinalcomment);


		var innercontainer = postmatchcontainer.getElementsByClassName('innercontainer')[0];

		innercontainer.appendChild(voteformvp);
		innercontainer.appendChild(voteforfinalreview);
		innercontainer.appendChild(commentarea);



		postmatchcontainertitle = document.createElement('div');
		postmatchcontainertitle.id = 'postmatchcontainertitle';
		postmatchcontainertitle.innerHTML = "<p>Match is over, but your opinion still counts:</p>";
		postmatchcontainer.appendChild(postmatchcontainertitle);

		postmatchcontainer.appendChild(MVP);
		postmatchcontainer.appendChild(finalreview);
		postmatchcontainer.appendChild(finalcomment);
		postmatchcontainer.appendChild(innercontainer);

		interactions.appendChild(postmatchcontainer);

	}
}

function displayMVP(){
	document.getElementById('mvp').style.display = 'block';
	document.getElementById('finalreview').style.display = 'none';
	document.getElementById('finalcomment').style.display = 'none';
	$(".submitbutton").hide();
	getMvpList();
	displayMvpRanking();
}

function displayFinalReview(){
	document.getElementById('mvp').style.display = 'none';
	document.getElementById('finalreview').style.display = 'block';
	document.getElementById('finalcomment').style.display = 'none';
	$(".submitbutton").hide();
}

function displayFinalComment(){
	document.getElementById('mvp').style.display = 'none';
	document.getElementById('finalreview').style.display = 'none';
	document.getElementById('finalcomment').style.display = 'block';
	$(".submitbutton").show();
}

function displayVouchers(unlimited){
	firebase.database().ref('/partnerbars/placeids/').once('value').then(function(snapshot) {

		snapshot.forEach(function(child) {
			firebase.database().ref('/checkins/' + child.val() + '/' + uid).once('value').then(function(snapshot) {
				if (snapshot.val() != null) {

					var voucherscontainer = document.getElementById('vouchercontainer');

					if(voucherscontainer == null){
						voucherscontainer = document.createElement('div');
						voucherscontainer.classList.add('vouchercontainer');
						voucherscontainer.id = 'vouchercontainer';

						var vouchercontainertitle = document.createElement('div');
						vouchercontainertitle.id = 'vouchercontainertitle';
						vouchercontainertitle.innerHTML = "<p>LOUDSTAND PARTNER</p>";

						var voucher1 = document.createElement('div');
						voucher1.id = 'voucher1';
						voucher1.classList.add('voucher');
						voucher1.innerHTML = "Discount #1";

						var voucher2 = document.createElement('div');
						voucher2.id = 'voucher2';
						voucher2.classList.add('voucher');
						voucher2.innerHTML = "Discount #2";

						if(unlimited){
							voucher2.style.display = 'none';
							voucher1.style.width = 90+ '%';

						}


						var vouchersRef = firebase.database().ref('/vouchers/' + uid + '/' +  gameid);
						vouchersRef.on('value', function (snapshot){

							voucher1.addEventListener("click", function () {
								if(snapshot.numChildren() == 0 || unlimited) {
									showVoucherOverlay(unlimited);
								}
							});
							voucher2.addEventListener("click", function () {
								if(snapshot.numChildren() < 2 || unlimited) {
									showVoucherOverlay(unlimited);
								}
							});


							if(!unlimited){
								if(snapshot.numChildren() == 0) {
									voucher1.style.backgroundColor = '#164065';
									voucher1.style.color = '#f6f6f6';
									voucher1.innerHTML = 'Discount #1';
									voucher2.style.backgroundColor = '#164065';
									voucher2.style.color = '#f6f6f6';
									voucher2.innerHTML = 'Discount #2';

								}

								if(snapshot.numChildren() == 1){
									voucher1.style.backgroundColor = 'black';
									voucher1.style.color = 'white';
									voucher1.innerHTML = 'Discount used.';
									voucher1.removeEventListener("click", function () {
										showVoucherOverlay();
									});
									voucher2.addEventListener("click", function () {
										showVoucherOverlay();
									});
								}

								if (snapshot.numChildren() == 2){
									voucher1.style.backgroundColor = 'black';
									voucher1.style.color = 'white';
									voucher1.innerHTML = 'Discount used.';
									voucher1.removeEventListener("click", function () {
										showVoucherOverlay();
									});
									voucher2.style.backgroundColor = 'black';
									voucher2.style.color = 'white';
									voucher2.innerHTML = 'Discount used.';
									voucher2.removeEventListener("click", function () {
										showVoucherOverlay();
									});

								}
							}

						});

						var interactions = document.getElementById('interactions');

						voucherscontainer.appendChild(vouchercontainertitle);
						voucherscontainer.appendChild(voucher1);
						voucherscontainer.appendChild(voucher2);
						interactions.appendChild(voucherscontainer);


					}


				}
			});
		});
	});
}

function hideFooter(){
	document.getElementById('footer').style.display = 'none';
}

function showVoucherOverlay(unlimited){
	document.getElementById('voucheroverlay').style.display = 'block';
	document.getElementById('voucheroverlaycontent').style.display = 'block';
	document.getElementById('voucheroverlaycontentborder').style.display = 'block';
	if(unlimited) {
		waxxiesVoucherDescription();
	}
	else{
		voucherDescription();
	}
}

function hideVoucherOverlay(){
	document.getElementById('voucheroverlay').style.display = 'none';
	document.getElementById('voucheroverlaycontent').style.display = 'none';
	document.getElementById('voucheroverlaycontentborder').style.display = 'none';
}


function voucherDescription () {

	var seenvoucher = JSON.parse(localStorage.getItem("seenvoucher"));

	console.log(seenvoucher);
	if (seenvoucher == null) {
		localStorage.setItem("seenvoucher", true);
		var voucherdescription = document.getElementById('voucherdescription');
		voucherdescription.innerHTML = "<div class='firstvoucher'>THE BARTENDER SHOULD CONFIRM. NOT YOU</style>";

	}
	else {

		var voucherdescription = document.getElementById('voucherdescription');
		voucherdescription.innerHTML = "LoudStand offers you discounts on " +
			"drinks in this bar during this match! Go to the bar and ask the bartender to swipe the voucher." +
			" The bartender should do it, not you. If you do it, you lose your right to your discount.";

		var button = document.createElement('button');
		button.classList.add('voucherconfirmation');
		button.id = 'voucherconfirmation';
		button.innerHTML = 'USE VOUCHER';
		button.disabled = false;
		button.addEventListener("click", function () {
			getPointsTable('voucher');
			hideVoucherOverlay();

			var vouchersRef = firebase.database().ref('/vouchers/' + uid + '/' + gameid);
			var randomvoucherNumber = Math.floor(Math.random() * Math.floor(1000000000));

			firebase.database().ref('/checkins/').on('value', function (snapshot) {
				snapshot.forEach(function (child) {
					var placeid = child.key();
					console.log(placeid);
				});


				vouchersRef.push({

					vouchernumber: randomvoucherNumber,
					timestamp: Math.floor(Date.now() / 1000),


				});
			});

			voucherdescription.appendChild(button);


		});
	}

}

function waxxiesVoucherDescription () {
	var seenvoucher = JSON.parse(localStorage.getItem("seenvoucher"));

	if (seenvoucher == null) {
		localStorage.setItem("seenvoucher", true);
		var voucherdescription = document.getElementById('voucherdescription');
		voucherdescription.innerHTML = "<div class='firstvoucher'>THE BARTENDER SHOULD CONFIRM. NOT YOU. WAXIES VERSION.</style>";

	}
	else {

		var voucherdescription = document.getElementById('voucherdescription');
		voucherdescription.innerHTML = "Waxxies Rules";

		var button = document.createElement('button');
		button.classList.add('voucherconfirmation');
		button.id = 'voucherconfirmation';
		button.innerHTML = 'USE VOUCHER';
		button.disabled = false;
		button.addEventListener("click", function () {
			getPointsTable('voucher');
			hideVoucherOverlay();

			firebase.database().ref('/checkins/').on('value', function (snapshot) {
				snapshot.forEach(function (child) {
					if (child.val()[uid] != null) {
						var key = Object.keys(child.val()[uid]);
						console.log(key);
					}
				});
			});


			var vouchersRef = firebase.database().ref('/vouchers/waxxies/' + uid);
			var randomvoucherNumber = Math.floor(Math.random() * Math.floor(10000000));

			vouchersRef.push({

				vouchernumber: randomvoucherNumber,
				timestamp: Math.floor(Date.now() / 1000)


			});
		});

		voucherdescription.appendChild(button);


	}
}

function displayStats(gameid){
	firebase.database().ref('/fixtures/' +  gameid + '/stats').once('value', function(snapshot){
		if(snapshot.val() != null){
		document.getElementById('homepossession').innerHTML = snapshot.val()['home']['possession'];
		var homeposessiondiv = document.getElementById('homepossession');
		homeposessiondiv.style.width = homeposessiondiv.innerHTML;

		document.getElementById('homeshotsoverall').innerHTML = snapshot.val()['home']['totalshots'];
		var homeshotsoveralldiv = document.getElementById('homeshotsoverall');
		homeshotsoveralldiv.style.width = homeshotsoveralldiv.innerHTML*4 + '%';

		document.getElementById('homeshotstarget').innerHTML = snapshot.val()['home']['shotstarget'];
		var homeshotstargetdiv = document.getElementById('homeshotstarget');
		homeshotstargetdiv.style.width = homeshotstargetdiv.innerHTML*4 + '%';

		document.getElementById('homeshots').innerHTML = snapshot.val()['home']['shots'];
		var homeshotsdiv = document.getElementById('homeshots');
		homeshotsdiv.style.width = homeshotsdiv.innerHTML*4 + '%';

		document.getElementById('homesaves').innerHTML = snapshot.val()['home']['saves'];
		var homesavesdiv = document.getElementById('homesaves');
		homesavesdiv.style.width = homesavesdiv.innerHTML*4 + '%';

		document.getElementById('homefouls').innerHTML = snapshot.val()['home']['fouls'];
		var homefoulsdiv = document.getElementById('homefouls');
		homefoulsdiv.style.width = homefoulsdiv.innerHTML*4 + '%';

		document.getElementById('homefreekicks').innerHTML = snapshot.val()['home']['freekicks'];
		var homefreekicksdiv = document.getElementById('homefreekicks');
		homefreekicksdiv.style.width = homefreekicksdiv.innerHTML*4 + '%';

		document.getElementById('homecorners').innerHTML = snapshot.val()['home']['corners'];
		var homecornersdiv = document.getElementById('homecorners');
		homecornersdiv.style.width = homecornersdiv.innerHTML*4 + '%';

		document.getElementById('homeoffside').innerHTML = snapshot.val()['home']['offside'];
		var homeoffsidediv = document.getElementById('homeoffside');
		homeoffsidediv.style.width = homeoffsidediv.innerHTML*4 + '%';

		document.getElementById('awaypossession').innerHTML = snapshot.val()['away']['possession'];
		var awayposessiondiv = document.getElementById('awaypossession');
		awayposessiondiv.style.width = awayposessiondiv.innerHTML;

		document.getElementById('awayshotsoverall').innerHTML = snapshot.val()['away']['totalshots'];
		var awayshotsoveralldiv = document.getElementById('awayshotsoverall');
		awayshotsoveralldiv.style.width = awayshotsoveralldiv.innerHTML*4 + '%';

		document.getElementById('awayshotstarget').innerHTML = snapshot.val()['away']['shotstarget'];
		var awayshotstargetdiv = document.getElementById('awayshotstarget');
		awayshotstargetdiv.style.width = awayshotstargetdiv.innerHTML*4 + '%';

		document.getElementById('awayshots').innerHTML = snapshot.val()['away']['shots'];
		var awayshotsdiv = document.getElementById('awayshots');
		awayshotsdiv.style.width = awayshotsdiv.innerHTML*4 + '%';

		document.getElementById('awaysaves').innerHTML = snapshot.val()['away']['saves'];
		var awaysavesdiv = document.getElementById('awaysaves');
		awaysavesdiv.style.width = awaysavesdiv.innerHTML*4 + '%';

		document.getElementById('awayfouls').innerHTML = snapshot.val()['away']['fouls'];
		var awayfoulsdiv = document.getElementById('awayfouls');
		awayfoulsdiv.style.width = awayfoulsdiv.innerHTML*4 + '%';

		document.getElementById('awayfreekicks').innerHTML = snapshot.val()['away']['freekicks'];
		var awayfreekicksdiv = document.getElementById('awayfreekicks');
		awayfreekicksdiv.style.width = awayfreekicksdiv.innerHTML*4 + '%';

		document.getElementById('awaycorners').innerHTML = snapshot.val()['away']['corners'];
		var awaycornersdiv = document.getElementById('awaycorners');
		awaycornersdiv.style.width = awaycornersdiv.innerHTML*4 + '%';

		document.getElementById('awayoffside').innerHTML = snapshot.val()['away']['offside'];
		var awayoffsidediv = document.getElementById('awayoffside');
		awayoffsidediv.style.width = awayoffsidediv.innerHTML*4 + '%';
	}
	});
}

function countGameMvpvotes(playerid){
    firebase.database().ref('startingeleven/users/').once('value', function(snapshot){
        var mvpcount = [];
        snapshot.forEach(function(child) {
            firebase.database().ref('startingeleven/users/' + child.key).once('value', function(snapshot){
                snapshot.forEach(function(child) {
                    if(child.val()['mvp'] != undefined && child.key == gameid){
                        if(playerid == child.val()['mvp']['playerid']){

                            if(mvpcount[playerid] == null){
                                mvpcount[playerid] = 1;
                            }
                            else{
                                mvpcount[playerid]++;
                            }
                            var playerdiv = document.getElementById(playerid);
                            var countspan = playerdiv.getElementsByClassName('mvpcountspan')[0];
                            countspan.innerHTML = mvpcount[playerid];
                        }
                    }
                });
            });
        });
    });
}

function manageTimestamps () {
	var game = getLiveGame();
	var timestamp = game.timestamp;
	var date = Math.floor(Date.now() / 1000);
	console.log(timestamp);

	if((date > timestamp-3600) && (date < timestamp)){
		console.log('true dat');
		document.getElementById('squad').style.display = 'none';
	}




	console.log(timestamp);

}
