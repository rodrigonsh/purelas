
var mapAPIKey = "AIzaSyAgQ3Td8h6homy1Hf2MIT9DUR9882g-42Q"

var map = null
var route = null
var reportNewMap = null
var reportViewMap = null
var mapsReady = false
var renderMap = null

function getCircle()
{
  return {
    path: google.maps.SymbolPath.Circle,
    fillColor: 'red',
    fillOpacity: .2,
    scale: 2,
    strokeColor: 'white',
    strokeWeight: .5
  };
}

function initMap()
{


  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: currentLatLng
  });

  map.data.setStyle(function(feature)
  {

    return
    {
      icon: getCircle()
    };

  });



  mapsReady = true

  if ( renderMap != null)
  {
    emit(renderMap+"Render")
    renderMap = null
  }

  /*var marker = new google.maps.Marker({
    position: cg,
    map: map
  });*/

}
