$("#ProduceCovid").on("click", () => {
  var countrycode = $("#countrySelect option:selected").attr("value");

  searchCountry(countrycode);
  createMap();
  //TestCenterLocation();
});

//Comment

function searchCountry(country) {
  $("#CovidInfo").toggle(false);
  $("#TestCenter").toggle(false);
  $("#Submit").toggle(false);

  $("#CovidDataDisplay").toggle(true);
  $("#GoogleMap").toggle(true);

  //template literals expression
  $.ajax({
    method: "GET",
    crossDomain: true,
    url: `https://rapidapi.p.rapidapi.com/country/code?code=${country}`,
    headers: {
      "x-rapidapi-host": "covid-19-data.p.rapidapi.com",
      "x-rapidapi-key": "bbc929ed92msh5abd064e1ccd0e9p1f53f0jsn469afcc81a7a"
    }
  })
    .then(handleResponse)
    .catch(function(err) {
      console.log(err);
    });
}

function handleResponse(response) {
  console.log(response);
  
  var CountryResponse = response[0].country;
  var eCountry = document.getElementById("CountryResponse");
  var LocalCases = response[0].confirmed;
  var eConfirmedCases = document.getElementById("confirmed");
  var LocalDeaths = response[0].deaths;
  var eConfirmedDeaths = document.getElementById("Deaths");
  var LocalRecovered = response[0].recovered;
  var eRecovered = document.getElementById("Recovered");
  var RecoveryRate = (LocalRecovered/LocalCases)*100;
  var eRecRate = document.getElementById("RecoverRate");
  var DeathRate = (LocalDeaths/LocalCases)*100;
  var eDeathRate = document.getElementById("DeathRate");
  var Update = response[0].lastUpdate;
  var eUpdateDisplay = document.getElementsByClassName("Update")
  
  eConfirmedCases.textContent = LocalCases;
  eConfirmedDeaths.textContent = LocalDeaths;
  eRecovered.textContent = LocalRecovered;
  eRecRate.textContent = RecoveryRate.toFixed(0)+"%";
  eDeathRate.textContent = DeathRate.toFixed(0)+"%";
  eCountry.textContent = CountryResponse;
  eUpdateDisplay.textContent = Update;
  

  console.log(response);
  console.log(LocalDeaths);

  //call test location API

  //do DOM manipulation
}

var map;
function createMap() {
  var options = {
    center: { lat: 39.7392, lng: -104.9903 },
    zoom: 10
  };
  map = new google.maps.Map(document.getElementById("map"), options);

  var input = document.getElementById("search");
  var searchBox = new google.maps.places.SearchBox(input);

  map.addListener("bounds_changed", function() {
    searchBox.setBounds(map.getBounds());
  });

  var markers = [];

  searchBox.addListener("places_changed", function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) return;

    markers.forEach(function(m) {
      m.setMap(null);
    });
    markers = [];

    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(p) {
      if (!p.geometry) return;

      markers.push(
        new google.maps.Marker({
          map: map,
          title: p.name,
          position: p.geometry.location
        })
      );

      if (p.geometry.viewport) bounds.union(p.geometry.viewport);
      else bounds.extend(p.geometry.location);
    });

    map.fitBounds(bounds);
  });
}

/*var map =
 function createMap() {
    var options={
      center:{lat:39.7392, lng:-104.9903},
      zoom:10
    };
    map= new google.maps.Map(document.getElementById('map'),options);
 }
*/

//original one
/*function TestCenterLocation() {
  /// Google API :
  var City = $("#CityInput").attr("value");
  //var Qurl = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${City}Museum%20of%20Contemporary%20Art%20Australia&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry"
  var key = "AIzaSyCCfUi1OEBugxR7jMTKbP7y22Y1V_BFodw";

  $.ajax({
    method: "GET",
    url: `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${City}inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&key=${key}`
  })
    .then(data => {
      console.log(data);
    })
    .catch(function(err) {
      console.log(err);
    });
}
var map;

function createMap() {
  var options = {
    center: { lat: 39.7392, lng: -104.9903 },
    zoom: 3
  };
  map = new google.maps.Map(document.getElementById("map"), options);
  geocoder = new google.maps.Geocoder();
  var address = document.getElementById("CityInput").value;
  function codeAddress() {
    geocoder.geocode({ address }, function(results, status) {
      if (status == "OK") {
        map.setCenter(results[0].geometry.location);
        getCovidLocations(results[0].geometry.location);
        var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location
        });
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
  }
  function getCovidLocations(LatLng) {
    console.log(LatLng);
    var request = {
      query: "restaurant",
      location: LatLng,
      radius: 10000
    };
    var service = new google.maps.places.PlacesService(map);

    service.textSearch(request, function(results, status) {
      console.log(results, status);
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          createMarker(results[i]);
        }
        map.setCenter(results[0].geometry.location);
      }
    });
  }
  codeAddress();
}
*/
