redirect();

function redirect(){
	firebase.auth().onAuthStateChanged(function(user) {
		var userRef = firebase.database().ref('rankings/users/' + user.uid + '/terms');
		userRef.once('value').then(function(snapshot) {
			if(snapshot.val()['terms'] == 'true'){
				window.location = "match.php";
			}
			else{
				var e = document.createElement('div');
				var acceptbutton = document.createElement('button');
            	var acceptbuttontext = document.createTextNode("Accept");
            	acceptbutton.appendChild(acceptbuttontext);

           		acceptbutton.addEventListener("click", function(){
           		firebase.database().ref('rankings/users/' + user.uid + '/terms').set({
           			terms: 'true'
           		});
           		window.location = "match.php";
           	});

           		var declinebutton = document.createElement('button');
           		var declinebuttontext = document.createTextNode("Decline");
           		declinebutton.appendChild(declinebuttontext);

           		declinebutton.addEventListener("click", function(){
           			alert('You need to accept the T&Cs');
           		});

            	e.appendChild(acceptbutton);
            	e.appendChild(declinebutton);
            	document.getElementById('buttons').appendChild(e);
            }
        });
	});
}