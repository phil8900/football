var fixtures = JSON.parse(localStorage.getItem("loudstand_fixtures"));

function initMatches(){
	document.getElementById('matchesbutton').src = 'img/calendar_select.svg';
	updateTeamRanking(true);
	showMatches();

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
			var gameid = child['gameid'];
			var stadium = child['location'];

		/*	if(nextgame){
				var wrapper = document.getElementById('upcoming');
				nextgame = false;
			}
			else{ */
				var wrapper = document.getElementById('matches');
				wrapper = $('#matches .swiper-wrapper').get(0);

		//	}
			var div = document.createElement('div');
			div.classList.add('activitybox');
			div.classList.add('matchbox');
			div.classList.add('swiper-slide');
			div.classList.add('matchescalendar');
			div.id = gameid;
			div.addEventListener('click', function(){ overlayOn(gameid); topBarBlack();});



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
					homefans.appendChild(document.createTextNode("Fans online: " + snapshot.val().averageage)); //CHANGE THIS TO TOTAL NUMBER OF FANS ONLINE
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
					awayfans.appendChild(document.createTextNode("Fans online: " + snapshot.val().averageage)); //CHANGE THIS TO TOTAL NUMBER OF FANS ONLINE
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

function overlayOn(gameid) {
	document.getElementById('overlay').style.display = 'block';

	var locations = document.getElementsByClassName('location');

	Array.prototype.forEach.call(locations, function(location) {
		location.addEventListener("click", function(){

			window.location = "match.php?gameid=" + gameid;
		});
	});
}

function overlayOff() {
	document.getElementById('overlay').style.display = 'none';
}

function topBarBlack (){
	document.getElementById('topNav').style.backgroundColor = 'black';

}


