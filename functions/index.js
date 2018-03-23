const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

 exports.addUserToRanking = functions.auth.user().onCreate((event) => {
  	var uid = event.data.uid;
  	var team = '-1';
  	var points = 5;
  	var name = 'Football Fan';

  admin.database().ref('rankings/users/' + uid).set({
    team: team,
    points: points,
    name : name,
    uid : uid
  });
});

 exports.deleteUserFromRanking = functions.auth.user().onDelete((event) => {
  var uid = event.data.uid;

  admin.database().ref('rankings/users/' + uid).remove();

});
