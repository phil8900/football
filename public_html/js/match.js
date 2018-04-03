var database = firebase.database();
var fixturesRef = firebase.database().ref('fixtures/');

reactToEvent('401859415', 2);

getEventReaction('401859415');

function getEventReaction(event_id){
		firebase.database().ref('/fixtures/').once('value').then(function(snapshot) {
		snapshot.forEach(function(child) {
		
			if(child.val().events[event_id]){
				console.log(child.val().events[event_id]);
			}
	});

});
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

function createRankingElement(string, id){
	var node = document.createElement("LI");
	var textnode = document.createTextNode(string);
	node.appendChild(textnode);
	document.getElementById(id).appendChild(node);
}

