var database = firebase.database();
var fixtures = JSON.parse(localStorage.getItem("loudstand_fixtures"));


gameid = getQueryVariable("gameid");


function showVouchersCinderela() {
	fixtures.forEach(function (child) {
		var gameid = child['gameid'];
		firebase.database().ref('/vouchers/' + gameid + '/').once('value', function (snapshot) {
			snapshot.forEach(function (child) {
				var allusers = child.key;

				firebase.database().ref('/vouchers/' + gameid + '/' + allusers).once('value', function (snapshot) {
					snapshot.forEach(function (child) {
						if(child.val().placeid == "ChIJRx5ytnQzGQ0Rq1QMG101qaQ"){
							var div = document.createElement('div');
							var text = document.createTextNode("Voucher nº: " + child.val().vouchernumber + " was used at " +(new Date(child.val().timestamp*1000)).toUTCString() + ' at Restaurante Pastelaria Cinderela');
							div.appendChild(text);
							document.getElementById('vouchers').appendChild(div);
						}
					});
				});
			});
		});
	});
	setTimeout(function() { numberOfTransactions(); }, 3000);
}

function showVouchersOpen() {
	fixtures.forEach(function (child) {
		var gameid = child['gameid'];
		firebase.database().ref('/vouchers/' + gameid + '/').once('value', function (snapshot) {
			snapshot.forEach(function (child) {
				var allusers = child.key;

				firebase.database().ref('/vouchers/' + gameid + '/' + allusers).once('value', function (snapshot) {
					snapshot.forEach(function (child) {
						if(child.val().placeid == "ChIJky66sps5GQ0RDiPrXPNIDzk"){
							var div = document.createElement('div');
							var text = document.createTextNode("Voucher nº: " + child.val().vouchernumber + " was used at " + (new Date(child.val().timestamp*1000)) + ' at Open Sports Bar');
							div.appendChild(text);
							document.getElementById('vouchers').appendChild(div);
						}
					});
				});
			});
		});
	});
	setTimeout(function() { numberOfTransactions(); }, 3000);
}

function showVouchersDomus() {
	fixtures.forEach(function (child) {
		var gameid = child['gameid'];
		firebase.database().ref('/vouchers/' + gameid + '/').once('value', function (snapshot) {
			snapshot.forEach(function (child) {
				var allusers = child.key;

				firebase.database().ref('/vouchers/' + gameid + '/' + allusers).once('value', function (snapshot) {
					snapshot.forEach(function (child) {
						if(child.val().placeid == "ChIJmw5Ecpk5GQ0RXIuek7u7VkE"){
							var div = document.createElement('div');
							var text = document.createTextNode("Voucher nº: " + child.val().vouchernumber + " was used at " + (new Date(child.val().timestamp*1000)) + ' at Domus Bar');
							div.appendChild(text);
							document.getElementById('vouchers').appendChild(div);
						}
					});
				});
			});
		});
	});
	setTimeout(function() { numberOfTransactions(); }, 3000);
}

function showVouchersOficina() {
	fixtures.forEach(function (child) {
		var gameid = child['gameid'];
		firebase.database().ref('/vouchers/' + gameid + '/').once('value', function (snapshot) {
			snapshot.forEach(function (child) {
				var allusers = child.key;

				firebase.database().ref('/vouchers/' + gameid + '/' + allusers).once('value', function (snapshot) {
					snapshot.forEach(function (child) {
						if(child.val().placeid == "ChIJi3ZNk7Q7GQ0RwoZnMVVeRI0"){
							var div = document.createElement('div');
							var text = document.createTextNode("Voucher nº: " + child.val().vouchernumber + " was used at " + (new Date(child.val().timestamp*1000)) + ' at Oficina Caffe');
							div.appendChild(text);
							document.getElementById('vouchers').appendChild(div);
						}
					});
				});
			});
		});
	});
	setTimeout(function() { numberOfTransactions(); }, 3000);
}

function showVouchersEnsaios() {
	fixtures.forEach(function (child) {
		var gameid = child['gameid'];
		firebase.database().ref('/vouchers/' + gameid + '/').once('value', function (snapshot) {
			snapshot.forEach(function (child) {
				var allusers = child.key;

				firebase.database().ref('/vouchers/' + gameid + '/' + allusers).once('value', function (snapshot) {
					snapshot.forEach(function (child) {
						if(child.val().placeid == "ChIJoYg2oGDMHg0R-Lm5bAYSHmE"){
							var div = document.createElement('div');
							var text = document.createTextNode("Voucher nº: " + child.val().vouchernumber + " was used at " + (new Date(child.val().timestamp*1000)) + ' at Ensaios & Temperos');
							div.appendChild(text);
							document.getElementById('vouchers').appendChild(div);
						}
					});
				});
			});
		});
	});
	setTimeout(function() { numberOfTransactions(); }, 3000);
}

function showVouchersCouch() {
	fixtures.forEach(function (child) {
		var gameid = child['gameid'];
		firebase.database().ref('/vouchers/' + gameid + '/').once('value', function (snapshot) {
			snapshot.forEach(function (child) {
				var allusers = child.key;

				firebase.database().ref('/vouchers/' + gameid + '/' + allusers).once('value', function (snapshot) {
					snapshot.forEach(function (child) {
						if(child.val().placeid == "ChIJ85OB0H00GQ0RtLH8jUoNs7U"){
							var div = document.createElement('div');
							var text = document.createTextNode("Voucher nº: " + child.val().vouchernumber + " was used at " + (new Date(child.val().timestamp*1000)) + ' at The Couch Sports Bar');
							div.appendChild(text);
							document.getElementById('vouchers').appendChild(div);
						}
					});
				});
			});
		});
	});
	setTimeout(function() { numberOfTransactions(); }, 3000);
}

function showVouchersWaxxies() {
	fixtures.forEach(function (child) {
		var gameid = child['gameid'];
		firebase.database().ref('/vouchers/' + gameid + '/').once('value', function (snapshot) {
			snapshot.forEach(function (child) {
				var allusers = child.key;

				firebase.database().ref('/vouchers/' + gameid + '/' + allusers).once('value', function (snapshot) {
					snapshot.forEach(function (child) {
						if (child.val().placeid == "ChIJNbq445M_TEYRQFix7VRFbIE") {
							var div = document.createElement('div');
							var text = document.createTextNode("Voucher nº: " + child.val().vouchernumber + " was used at " + (new Date(child.val().timestamp * 1000)) + ' at Waxies');
							div.appendChild(text);
							document.getElementById('vouchers').appendChild(div);
						}
					});
				});
			});
		});
	});

	firebase.database().ref('/vouchers/waxxies/').once('value', function (snapshot) {
		snapshot.forEach(function (child) {
			var allusers = child.key;

			firebase.database().ref('/vouchers/waxxies/' + allusers).once('value', function (snapshot) {
				snapshot.forEach(function (child) {
					console.log(child.val());


					var div = document.createElement('div');
					var text = document.createTextNode("Voucher nº: " + child.val().vouchernumber + " was used at " + (new Date(child.val().timestamp * 1000)) + ' at Waxies');
					div.appendChild(text);
					document.getElementById('vouchers').appendChild(div);

				});

			});

		});
	});


	setTimeout(function () {
		numberOfTransactions();
	}, 3000);



}




function hideOverlay(){
	document.getElementById("barsoverlay").style.display = 'none';
}

function numberOfTransactions() {
	var totalNumberOfTransactions = document.getElementById("vouchers").childElementCount;
	document.getElementById("totalcount").innerHTML = "<br>" + "TOTAL OF VOUCHERS USED: " + totalNumberOfTransactions;

}

function barsLogin() {
	var x, text;
	x = document.getElementById("password").value;

	if (x == 'cinderela190') {
		showVouchersCinderela();
		hideOverlay();
	}

	if (x == 'opensportsbar190') {
		showVouchersOpen();
		hideOverlay();
	}

	if (x == 'domusbar190') {
		showVouchersDomus();
		hideOverlay();
	}

	if (x == 'oficina190') {
		showVouchersOficina();
		hideOverlay();
	}

	if (x == 'ensaios190') {
		showVouchersEnsaios();
		hideOverlay();
	}

	if (x == 'thecouch190') {
		showVouchersCouch();
		hideOverlay();
	}

	if (x == 'waxies190') {
		showVouchersWaxxies();
		hideOverlay();
	}

	else {
		text = "Wrong password. Try again.";
	}

	document.getElementById("errormessage").innerHTML = text;


}

function enterButton() {

	var x = document.getElementById("password");
	x.addEventListener("keyup", function(event) {
		event.preventDefault();
		if (event.keyCode === 13) {
			barsLogin();
		}
	});

}