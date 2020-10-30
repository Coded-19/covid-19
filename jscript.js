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
// Google Api starts here
var map;
// create Map w/option object w/attributes for coordinates(latitude, longitude) and zoom 10
function createMap() {
  var options = {
    center: { lat: 39.7392, lng: -104.9903 },
    zoom: 10
  };
  // calling map constructor to render map and pass the reference to element (map),options objects
  map = new google.maps.Map(document.getElementById("map"), options);
  // to search a place ask input and its reference to it
  var input = document.getElementById("search");
  //initialize search box w/input element(google map constructor)
  var searchBox = new google.maps.places.SearchBox(input);
  // listener for bounds changed event(passing callbakc function)
  map.addListener("bounds_changed", function() {
    //set bounds to the map (on the searchbox)
    searchBox.setBounds(map.getBounds());
  });

  // search result array
  var markers = [];
  //event listener for places changed(on the search box)
  searchBox.addListener("places_changed", function() {
    //var for storing  places , get it from searchBox
    var places = searchBox.getPlaces();
    // if no places found (or array is empty) then return
    if (places.length == 0) return;
    // to clear any markers placed b4 , use for each method on the  array
    // w/callback function passing current marker
    markers.forEach(function(m) {
      // in this marker SetMap to null
      m.setMap(null);
    });
    // reseting marker array back to 0
    markers = [];
    // create bounds object LatLgnBounds method
    // iterate over Places array and add marker for each
    var bounds = new google.maps.LatLngBounds();
    // check if the places has a geometry attribut
    //if not then return 
    // don't want to anything w/that place
    
    places.forEach(function(p) {
      if (!p.geometry) return;
    // push a marker to the marker array and 
    //w constructor takes attribute (the map, name, location(position from geometry object))
      markers.push
      (new google.maps.Marker({
          map: map,
          title: p.name,
          position: p.geometry.location
        })
      );
      //update the bounds
      // if  geometry of place  has viewport attr
      //then pass it to Union on our bounds obj created b4(set to bounds to a combination w/this new viewport)
      if (p.geometry.viewport) bounds.union(p.geometry.viewport);
      //else doesn't have viewport then pass location to extend method
      // of our bounds P. geometry location
      else bounds.extend(p.geometry.location);
    });
    // calling the fitbounds method our map object pass in those bounds
    map.fitBounds(bounds);
  });
}

// JavaScript: the earlier version w/Ajax w/assistance Chad
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
*/
