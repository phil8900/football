const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

 exports.addUserToRanking = functions.auth.user().onCreate((event) => {
  	var uid = event.data.uid;
  	var team = '-1';
  	var points = 5;
  	var name = 'Football Fan';

  admin.database().ref('users/' + uid).set({
    team: team,
    points: points,
    name : name
  });
});

 exports.deleteUserFromRanking = functions.auth.user().onDelete((event) => {
  var uid = event.data.uid;

  admin.database().ref('users/' + uid).remove();

});
