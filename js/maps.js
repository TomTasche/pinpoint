var cityName = null;
var cityCoordinate = null;
var selectionMarker = null;

var map = null;
var guessMarker = null;
var geocoder = null;

var geocoding = true;

function initialize() {
    geocoder = new google.maps.Geocoder();

    var mapStyle = [{
        "featureType": "administrative",
        "elementType": "labels",
        "stylers": [{
            "visibility": "off"
        }]
    }, {
        "featureType": "poi",
        "elementType": "labels",
        "stylers": [{
            "visibility": "off"
        }]
    }, {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [{
            "visibility": "off"
        }]
    }, {
        "featureType": "transit",
        "elementType": "labels",
        "stylers": [{
            "visibility": "off"
        }]
    }, {
        "featureType": "water",
        "elementType": "labels",
        "stylers": [{
            "visibility": "off"
        }]
    }, {}];

    var mapOptions = {
        zoom: 2,
        center: new google.maps.LatLng(47.696472, 13.3457347),
        styles: mapStyle
    };

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    google.maps.event.addListener(map, 'click', onMapClicked);

    endProgress();
}

function onMapClicked(event) {
    if (geocoding) {
        alertify.error("Wait for it...");

        return;
    }

    if (!guessMarker) {
        guessMarker = new google.maps.Marker({
            position: event.latLng,
            map: map,
            title: cityName + "?"
        });
    } else {
        guessMarker.setPosition(event.latLng);
    }

    var distance = google.maps.geometry.spherical.computeDistanceBetween(cityCoordinate, event.latLng);
    var distanceKm = distance / 1000;

    var message = "<p>" + "So close! " + "<b>" + distanceKm.toFixed(2) + "km off." + "</b></p><p>" + "The map is now zoomed in to the real position of " + cityName + "." + "</p>";
    var buttonName = "Next city...";
    var callback = fetchNextCityAndStartGame;
    showOneButtonDialog(message, buttonName, callback);
    
    map.setCenter(cityCoordinate);
    map.setZoom(10);
}

function fetchNextCityAndStartGame() {
    fetchNextCity(function(cityResponse) {
      var cityName = cityResponse.name;
      alertify.alert("Guess where " + cityName + " is?", function() {
        startNewGame(cityName);
      });
    });
}

function fetchNextCity(callback) {
    var cityRequest = new XMLHttpRequest();
    cityRequest.onload = function() {
        if (this.status != 200) {
            alertify.error("An error occurred. Please reload the page.");

            return;
        }

        var responseObject = JSON.parse(this.responseText);
        callback(responseObject);
    };
    cityRequest.open("GET", "randomCity", true);
    cityRequest.send();
}

function startNewGame(newCityName) {
    cityName = newCityName;

    geocoding = true;
    startProgress();

    geocoder.geocode({
        address: newCityName
    }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            cityCoordinate = results[0].geometry.location;

            endProgress();
            geocoding = false;
        }
        else {
            window.alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}

google.maps.event.addDomListener(window, 'load', initialize);
