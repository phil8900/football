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
              radius: 500
            }, callback);

            map.setCenter(pos);
            initAutocomplete(map);
            console.log(map.getBounds());

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
          showResults(results);
          }
        }


      function showResults(results){
        for (var i = 0; i < results.length; i++) {
          var e = document.createElement('div');
          e.classList.add('userelement');
          e.classList.add("location");

          var p = document.createElement('p');
          p.classList.add('userrankingname');
          p.innerHTML = results[i].name;

          e.appendChild(p);

          document.getElementById("results").appendChild(e);
          addListener(e, results[i]);



        }
      }

      function addListener(button, result){
        button.addEventListener("click", function(){
          var interaction = 'checkinelse';

          var checkinRef = firebase.database().ref('checkins/' + result.place_id + '/' + uid);
          var partnerRef = firebase.database().ref('partnerbars/placeids/');

          partnerRef.once('value', function(snapshot) {
            snapshot.forEach(function(child) {
            if(child.val() == result.place_id){
              interaction = 'checkinbar';
            }
            });
            getPointsTable(interaction);
          });



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
        //  console.log(postData);

        });



      }

      function initAutocomplete(map) {

        // Create the search box and link it to the UI element.
        var input = document.getElementById('pac-input');

        var displaySuggestions = function(predictions, status) {
          if (status != google.maps.places.PlacesServiceStatus.OK) {
            alert(status);
            return;
          }
          var div = document.getElementById("placesresult");
            div.innerHTML = "";
          var service = new google.maps.places.PlacesService(map);


          predictions.forEach(function(prediction) {
            service.getDetails({
              placeId: prediction.place_id
            }, function(place, status) {
              if (status === google.maps.places.PlacesServiceStatus.OK) {


            var li = document.createElement('div');
            li.classList.add("userelement");
                li.classList.add("location");

                li.appendChild(document.createTextNode(place.name));


                var p = document.createElement('p');
            p.classList.add('userrankingname');
            p.appendChild(li);
            div.appendChild(p);
                addListener(li, place);

              }
            });
          });
        };

        var service = new google.maps.places.AutocompleteService();
        //var defaultBounds = map.getBounds();
        console.log(map.center);

        input.addEventListener("keyup", function(){
          if(input.value == ''){
            document.getElementById("placesresult").style.display = "none";
            document.getElementById("results").style.display = "block";
          }
          else{
          service.getPlacePredictions({ input: input.value, location: map.center, radius: 500 }, displaySuggestions);
          document.getElementById("placesresult").style.display = "block";
          document.getElementById("results").style.display = "none";
          }

        });

      }

