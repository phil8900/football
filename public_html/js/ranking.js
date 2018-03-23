var database = firebase.database();

var ref = database.ref().child('/users/').orderByChild('points').once('value').then(function(snapshot) {
	snapshot.forEach(function(child) {
	console.log(child.val()) // NOW THE CHILDREN PRINT IN ORDER
	});
});