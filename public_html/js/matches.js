var fixtures = JSON.parse(localStorage.getItem("loudstand_fixtures"));

function initMatches(matches){
	document.getElementById('matchesbutton').src = 'img/calendar_select.svg';
	updateTeamRanking(true);
	showMatches();
	tutorialMatches();

	if(matches){
		var swiper = new Swiper('.swiper-container', {
			initialSlide: 1,
			effect: 'coverflow',
			direction: 'vertical',
			grabCursor: true,
			centeredSlides: true,
			slidesPerView: 'auto',
			coverflowEffect: {
				rotate: 50,
				stretch: 0,
				depth: 100,
				modifier: 1,
				slideShadows : true
			}
		});
	}
}

function showMatches(){
	var worldCupStart = 1528848000; //June 13th 2018 00h00h00
	var worldCupEnd = 1531699200; //July 16th 2018 00h00h00
	var currenttime = Math.floor(Date.now() / 1000);
	var nextgame = true;

	var wrapper = document.getElementById('matches');
	wrapper = $('#matches .swiper-wrapper').get(0);

	if(wrapper != undefined){

	fixtures.sort(function(a, b){return a.timestamp-b.timestamp});
	fixtures.forEach(function(child) {
		if((child['timestamp'] < worldCupEnd)){
			var hometeam = child['hometeamid'];
			var awayteam = child['awayteamid'];
			var date = child['date'];
			var calcdate = new Date(child.timestamp * 1000 + new Date().getTimezoneOffset() + 60000);
			var time = calcdate.toString("hh:mm tt");

			var gameid = child['gameid'];
			var stadium = child['location'];

			var div = document.createElement('div');
			div.classList.add('activitybox');
			div.classList.add('matchbox');
			div.classList.add('swiper-slide');
			div.classList.add('matchescalendar');
			div.id = gameid;
			div.addEventListener('click', function(){
				overlayOn(gameid); topBarBlack();
			});


			var livegame = getLiveGame();
			if (child['timestamp'] == livegame['timestamp']) {
				var livenow = document.createElement('div');
				livenow.classList.add('livenow');
				livenow.innerHTML = '• LIVE';
				div.appendChild(livenow);
				livenow.innerHTML = '• LIVE';
				}

			var homediv = document.createElement('div');
			homediv.classList.add('homediv');

			firebase.database().ref('/teams/' + hometeam + '/information').once('value', function(snapshot) {
				if(snapshot.val() != null){
					var logo = document.createElement('img');
					logo.src = snapshot.val().teamlogo;
					logo.classList.add('matchlogo');

					var home = document.createElement('div');
					home.appendChild(document.createTextNode(snapshot.val().teamname));
					home.classList.add('matchhometeam');

					var homefans = document.createElement('div');

					firebase.database().ref('fixtures/' + gameid + '/' + hometeam).once('value', function(snapshot){
						var online = 0;
						if(snapshot.val() != null){
							online = snapshot.val();
						}
						homefans.appendChild(document.createTextNode("Fans online: " + online));
					});

					homefans.classList.add('matchhomefans');

					homediv.appendChild(logo);
					homediv.appendChild(home);
					homediv.appendChild(homefans);
				}
			});
			div.appendChild(homediv);

			var timediv = document.createElement('div');
			timediv.classList.add('timediv');
			var paragraph = document.createElement('p');
			paragraph.appendChild(document.createTextNode(time));
			paragraph.classList.add('time');
			var dateparagraph = document.createElement('p');
			dateparagraph.appendChild(document.createTextNode(date));
			dateparagraph.classList.add('matchdate');
			var location = document.createElement('p');
			location.appendChild(document.createTextNode(stadium));
			location.classList.add('stadium');

			timediv.appendChild(location);
			timediv.appendChild(paragraph);
			timediv.appendChild(dateparagraph);
			div.appendChild(timediv);

			var awaydiv = document.createElement('div');
			awaydiv.classList.add('awaydiv');

			firebase.database().ref('/teams/' + awayteam + '/information').once('value', function(snapshot) {
				if(snapshot.val() != null){
					var logo = document.createElement('img');
					logo.src = snapshot.val().teamlogo;
					logo.classList.add('matchlogo');

					var away = document.createElement('div');
					away.appendChild(document.createTextNode(snapshot.val().teamname));
					away.classList.add('matchawayteam');

					var awayfans = document.createElement('div');

					firebase.database().ref('fixtures/' + gameid + '/' + awayteam).once('value', function(snapshot){
						var online = 0;
						if(snapshot.val() != null){
							online = snapshot.val();
						}
						awayfans.appendChild(document.createTextNode("Fans online: " + online));
					});

					awayfans.classList.add('matchawayfans');

					awaydiv.appendChild(logo);
					awaydiv.appendChild(away);
					awaydiv.appendChild(awayfans);
				}
			});
			div.appendChild(awaydiv);			
			
			wrapper.appendChild(div);
			
		}
	});
	}
}

function overlayOn(gameid) {
	var livegame = getLiveGame();
	if(gameid == livegame.gameid){
		firebase.database().ref('checkins').once('value', function(snapshot){
			snapshot.forEach(function(child){

				for(var key in child.val()[uid]){
					if(child.val()[uid][key]['gameid'] != undefined){
						if(gameid == child.val()[uid][key]['gameid']){
							window.location = "match.php?gameid=" + gameid;
						}
				}
			}

		});
	});
	document.getElementById('overlay').style.display = 'block';
	setLocationGameId(gameid);
}
else{
	firebase.database().ref('fixtures/' + gameid).once('value', function(snapshot){
		if(snapshot.val()['timestamp'] < Math.floor(Date.now() / 1000)){
			window.location = "match.php?gameid=" + gameid;
		}
	});
}
}

function overlayOff() {
	document.getElementById('overlay').style.display = 'none';
	document.getElementById('topNav').style.backgroundColor = '#0F281D';
	document.getElementById('firstsubtopnav').style.backgroundColor = '#0F281D';
}

function topBarBlack (){
	document.getElementById('topNav').style.backgroundColor = 'black';
	document.getElementById('firstsubtopnav').style.backgroundColor = 'black';

}

function tutorialMatches() {
	var seenvoucher = JSON.parse(localStorage.getItem("seentutorialmatches"));

	if (seenvoucher == null) {
		localStorage.setItem("seentutorialmatches", true);
		$('#tutorial').fadeIn('slow');
		$('#tutorialcontent').fadeIn('slow');


	}
}


