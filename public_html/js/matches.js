var fixtures = JSON.parse(localStorage.getItem("loudstand_fixtures"));

function initMatches(){
	document.getElementById('matchesbutton').src = 'img/calendar_select.svg';
	updateTeamRanking(true);
	showMatches();
}

function showMatches(){
	var currenttime = Math.floor(Date.now() / 1000);
	var nextgame = true;

	fixtures.sort(function(a, b){return a.timestamp-b.timestamp});
	fixtures.forEach(function(child) {
		if(child['timestamp'] > currenttime-9000){
			var hometeam = child['hometeamid'];
			var awayteam = child['awayteamid'];
			var date = child['date'];
			var time = child['time'];

			if(nextgame){
				var wrapper = document.getElementById('upcoming');
				nextgame = false;
			}
			else{
				var wrapper = document.getElementById('matches');

			}
			var div = document.createElement('div');
			div.classList.add('acitivitybox');
			div.classList.add('matchbox');

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

					homediv.appendChild(logo);
					homediv.appendChild(home);
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

					awaydiv.appendChild(away);
					awaydiv.appendChild(logo);
				}
			});
			div.appendChild(awaydiv);
			wrapper.appendChild(div);
		}
	});
}

