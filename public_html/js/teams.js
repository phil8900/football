initTeamSelector();

  function initTeamSelector(){
    var fixturesRef = firebase.database().ref('teams/');
    fixturesRef.on('value', function(snapshot) {
      snapshot.forEach(function(child) {
        var e = document.createElement('div');
        var button = document.createElement('button');
        var buttontext = document.createTextNode(child.val()['information']['teamname']);
        button.appendChild(buttontext);

        addListener(button, child);

        e.appendChild(button);
        document.getElementById('buttons').appendChild(e);
      });
    });
  }

  function addListener(button, team){
    var teamRef = firebase.database().ref('rankings/users/' + uid + '/team');
     button.addEventListener("click", function(){
      ownteam = team.key;
      teamRef.set(ownteam);
     });
  }