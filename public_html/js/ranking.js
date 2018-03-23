var database = firebase.database();

getRanking('rankings/users/');
getRanking('rankings/teams/');

function getRanking(childstring){
	var array = new Array();
	var teams = database.ref().child(childstring).orderByChild('points').once('value').then(function(snapshot) {
		snapshot.forEach(function(child) {
		array.push(child.val());
		});
	});
	return array;
}