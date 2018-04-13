var database = firebase.database();
var fixturesRef = firebase.database().ref('fixtures/');

var fixtures = JSON.parse(localStorage.getItem("loudstand_fixtures"));
var ownteam = JSON.parse(localStorage.getItem("loudstand_ownteam"));

var nextgame;

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

function getLiveGameEvents(){
	var livegame = getLiveGame();
	if(livegame){
		firebase.database().ref('/fixtures/' + livegame.gameid + '/events/').on('value', function(snapshot) {
			snapshot.forEach(function(child) {
				var wrapper = document.getElementById(livegame.gameid);
				var eventwrapper = document.getElementById(child.val().eventId);
				if((wrapper == null) || (eventwrapper == null)){
					createWrappers(livegame.gameid, child.val().eventId);
					showEvents(child.val(), livegame.gameid);
				}
			});
		});
	}
	else{
		showTeamNews();
	}
}

function showTeamNews(){
	var wrapper = document.getElementById('events');

			firebase.database().ref('/teams/' + ownteam + '/information/news').on('value', function(snapshot) {
			snapshot.forEach(function(child) {
				var li = document.createElement('li');
				var div = document.createElement('div');
				var p = document.createElement('p');
				var newlink = document.createElement('a');
				newlink.setAttribute('href', child.val()['url']);
				newlink.setAttribute('target', '_blank')
				newlink.innerHTML = 'Read more...';
				p.appendChild(document.createTextNode(child.val()['date'] + ': ' + child.val()['title'] + ' '));
				p.appendChild(newlink);
				div.appendChild(p);

				li.appendChild(div);
				wrapper.appendChild(li);
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
	var eventwrapper = document.getElementById(event.eventId);

	var score = document.createElement('div');
	var text = document.createTextNode(event.tore_h + ' : ' + event.tore_g);
	score.appendChild(text);
	score.classList.add('score');
	eventwrapper.appendChild(score);


	var eventlist = document.createElement("ul");
	var eventid = document.createTextNode(event.eventId);
	eventlist.appendChild(eventid);

	var typespan = document.createElement("div");
	var type = document.createTextNode(event.type);
	typespan.appendChild(type);
	typespan.classList.add(event.type);
	eventlist.appendChild(typespan);

	if(event.type == 'karte'){
	var cardspan = document.createElement("div");
	var card = document.createTextNode(event.subtype);
	cardspan.appendChild(card);
	cardspan.classList.add(event.type);
	cardspan.classList.add(event.subtype);
	eventlist.appendChild(cardspan);
	}

	var minutespan = document.createElement("div");
	var minute = document.createTextNode(event.minute);
	minutespan.appendChild(minute);
	minutespan.classList.add('minute');
	eventlist.appendChild(minutespan);



	firebase.database().ref('/teams/' + event.verein_id + '/information').once('value', function(snapshot) {
		var teamname = event.verein_id;
		if(snapshot.val() != null){
			teamname = snapshot.val().teamname;
		}
		var vereinspan = document.createElement("div");
		var verein = document.createTextNode(teamname);
		vereinspan.appendChild(verein);
		vereinspan.classList.add('verein');
		eventlist.appendChild(vereinspan);
		});

		getPlayerInfo(event.spieler_id_1, event, eventlist);

		if(event.type == 'wechsel'){
			getPlayerInfo(event.spieler_id_2, event, eventlist);
		}

	
	eventwrapper.appendChild(eventlist);
	getEventReaction(event.eventId);

}

function getPlayerInfo(playerid, event, eventlist){
	var eventwrapper = document.getElementById(event.eventId);
	var playername = playerid;

	firebase.database().ref('/teams/' + event.verein_id + '/squad/' + playerid).once('value', function(snapshot) {
		if(snapshot.val() != null){
			playername = snapshot.val().shortname;
		}
		var playerspan = document.createElement("div");
		var player = document.createTextNode(playername);
		playerspan.appendChild(player);
		playerspan.classList.add('player');
		eventlist.appendChild(playerspan);
		});
}

function getTeamInfo(gameid){

	var wrapper = document.getElementById(gameid);
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
	wrapper.appendChild(gameheader);

	var ref = firebase.database().ref('/fixtures/' + gameid).once('value', function(snapshot) {
		var hometeam = snapshot.val().hometeamid;
		homespan.id = hometeam;
		var awayteam = snapshot.val().awayteamid;
		awayspan.id = awayteam;
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

	eventwrapper.getElementsByClassName('positive')[0].innerHTML = 'Positive ' + reaction.positive;
	eventwrapper.getElementsByClassName('negative')[0].innerHTML = 'Negative ' + reaction.negative;
}

function createWrappers(game_id, event_id){
	var wrapper = document.getElementById(game_id);
	var eventwrapper = document.getElementById(event_id);

	if(wrapper == null){
		wrapper = document.createElement("div");
		wrapper.id = game_id;
		document.getElementById('events').appendChild(wrapper);
		getTeamInfo(game_id);
	}
	if(eventwrapper == null){
		eventwrapper = document.createElement("div");
		eventwrapper.id = event_id;

		var positive = document.createElement('div');
		positive.classList.add('positive');
		var negative = document.createElement('div');
		negative.classList.add('negative');

		eventwrapper.appendChild(positive);
		eventwrapper.appendChild(negative);
		wrapper.appendChild(eventwrapper);

		var upbutton = document.createElement("button");
		var uptext = document.createTextNode("Upvote");
		upbutton.appendChild(uptext);

		upbutton.addEventListener("click", function(){
    		reactToEvent(event_id, 1);
    		upbutton.disabled = true;
    		downbutton.disabled = true;
		}); 

		var downbutton = document.createElement("button");
		var downtext = document.createTextNode("Downvote");
		downbutton.appendChild(downtext);

		downbutton.addEventListener("click", function(){
    		reactToEvent(event_id, -1);
    		downbutton.disabled = true;
    		upbutton.disabled = true;
		}); 

		eventwrapper.appendChild(upbutton);
		eventwrapper.appendChild(downbutton);
	}
}

function reactToEvent(event_id, reaction){
		firebase.database().ref('/fixtures/').once('value').then(function(snapshot) {

		snapshot.forEach(function(child) {
			firebase.database().ref('/fixtures/' + child.key + '/events/' + event_id).once('value').then(function(snapshot) {
				if(snapshot.val() != null){
					var reactionRef = firebase.database().ref('/fixtures/' + child.key + '/events/' + event_id + '/reactions');
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
