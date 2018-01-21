

var mapAPIKey = "AIzaSyAgQ3Td8h6homy1Hf2MIT9DUR9882g-42Q"

var map = null;
var route = null;
var report = null;

$map = q("#map")
$map.addEventListener('touchmove', function(ev){
  ev.stopPropagation()
})

function initMap()
{

  var cg = {lat: -20.4670068, lng: -54.6222753};

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: cg
  });

  var marker = new google.maps.Marker({
    position: uluru,
    map: map
  });

}
