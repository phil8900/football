var database = firebase.database();

exports.sendWelcomeEmail = functions.auth.user().onCreate((event) => {
    var uid = event.data.uid;
  var team = 'Not yet chosen';
  var points = 5;
  var name = 'Philip';

  console.log("db called");
  firebase.database().ref('users/' + uid).set({
    team: team,
    points: points,
    name : name
  });
});