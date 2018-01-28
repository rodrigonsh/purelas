
var mapAPIKey = "AIzaSyAgQ3Td8h6homy1Hf2MIT9DUR9882g-42Q"

var map = null;
var route = null;
var report = null;

function initMap()
{

  var cg = {lat: -20.4670068, lng: -54.6222753};

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: cg
  });

  var marker = new google.maps.Marker({
    position: cg,
    map: map
  });

}
