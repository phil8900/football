      var map;
      var infowindow;


      function initMap() {
        var pos = {lat: 56.132427, lng: 10.1528922};

        // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            map = new google.maps.Map(document.getElementById('map'), {
              center: pos,
              zoom: 15
            });

            var service = new google.maps.places.PlacesService(map);
            service.nearbySearch({
              location: pos,
              radius: 500,
            }, callback);

            map.setCenter(pos);
          }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
      }
    }

      function callback(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            var e = document.createElement('div');
            e.classList.add('userelement');
            var p = document.createElement('p');
            p.classList.add('userrankingname');
            p.innerHTML = results[i].name;
            var button = document.createElement('button');
            var symbol = document.createElement('i');
            symbol.classList.add('fas');
            symbol.classList.add('fa-compass');
            button.classList.add('upbutton');
            button.appendChild(symbol);

            button.classList.add('checkinbutton');
            p.appendChild(button);
            e.appendChild(p);
            document.getElementById("results").appendChild(e);
            addListener(button, results[i]);

          }
        }
      }

      function addListener(button, result){
        button.addEventListener("click", function(){
          var checkinRef = firebase.database().ref('checkins/' + result.place_id + '/' + uid);

          var newPostKey = checkinRef.push().key;
          var postData = {
            timestamp: Math.floor(Date.now() / 1000),
            placeid: result.place_id,
            placename:result.name,
            uid: uid,
          };

          var updates = {};
          updates['checkins/' + result.place_id + '/' + uid + '/' + newPostKey] = postData;

          firebase.database().ref().update(updates);

          button.disabled = true;
        }); 
      }