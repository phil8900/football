initTeamSelector();

  function initTeamSelector(){
    var fixturesRef = firebase.database().ref('teams/');
    fixturesRef.on('value', function(snapshot) {
      var e = document.createElement('div');
      snapshot.forEach(function(child) {
        var button = document.createElement('button');
          button.classList.add('teamselect');
        button.style.background = 'url(' + child.val()['information']['teamlogo'] + ')';

        addListener(button, child);

        e.appendChild(button);
        document.getElementById('teamselectbuttons').appendChild(e);
      });
    });
  }

  function addListener(button, team){
    var teamRef = firebase.database().ref('rankings/users/' + uid + '/team');
     button.addEventListener("click", function(){
      ownteam = team.key;
      teamRef.set(ownteam);
      location.href = "home.php";
      setOwnTeam();
     });
  }