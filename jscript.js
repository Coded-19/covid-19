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


