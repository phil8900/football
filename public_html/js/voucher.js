var database = firebase.database();
var vouchersRef = firebase.database().ref('testforbars/');


function showVouchers(){
	vouchersRef.on('value', function(snapshot) {
		snapshot.forEach(function(child) {
		var div = document.createElement('div');
		var text = document.createTextNode(child.val().name + " " + child.val().vouchernumber);
		div.appendChild(text);
		document.getElementById('vouchers').appendChild(div);
		});
	});

}