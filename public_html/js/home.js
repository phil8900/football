var ownteam = JSON.parse(localStorage.getItem("loudstand_ownteam"));

function initHome(){
	getNews(false);
	document.getElementById('homebutton').src = 'img/home_select.svg';
}

function getNews(ownnews){
	var wrapper = document.getElementById('news');
	var teamsRef = firebase.database().ref('/teams/');
	var news = [];

	teamsRef.on('value', function(snapshot) {
		snapshot.forEach(function(child) {
			var teamnews = child.val()['information']['news'];
			if(teamnews != null){
				teamnews.forEach(function(newsitem) {
					newsitem['team'] = child.val()['information']['teamname'];
					newsitem['teamid'] = child.key;
					news.push(newsitem);
				});
			}
		});
		news.sort(function(a, b) {
  			return b.timestamp - a.timestamp;
		});
		showNews(news, 20, ownnews);
	});
}

function showNews(news, limit, ownnews){
	var wrapper = document.getElementById('news');

	if(!ownnews){
		news = news.slice(0, limit);
	}

	news.forEach(function(child) {
		if(ownnews){
			if(child['teamid'] != ownteam){
				return;
			}
		}
				var div = document.createElement('div');

				var date = document.createElement('p');
				var datesymbol = document.createElement('i');
				datesymbol.classList.add('far');
				datesymbol.classList.add('fa-clock');
				date.appendChild(datesymbol);
				date.classList.add('date');
				date.appendChild(document.createTextNode(' ' + child['date']));
				div.appendChild(date);

				var headline = document.createElement('h2');
				headline.appendChild(document.createTextNode(child['team']));
				div.appendChild(headline);

				var p = document.createElement('p');
				p.appendChild(document.createTextNode(child['title']));
				p.classList.add('newstitle');
				div.appendChild(p);

				var linkdiv = document.createElement('div');
				var newlink = document.createElement('a');
				newlink.setAttribute('href', child['url']);
				newlink.setAttribute('target', '_blank')
				newlink.innerHTML = 'Read more...';
				linkdiv.classList.add('newslink');
				linkdiv.appendChild(newlink);
				div.appendChild(linkdiv);


				div.classList.add('newsitem');

				wrapper.appendChild(div);
			});
}

function readMore(){
	$(document).ready(function() {
		$('.readmore').click(function() {

			$(this).siblings('.newsdescription').animate({
				height: '100%',
				duration: 1000,
			});

			$(this).hide();

		});
	});
}