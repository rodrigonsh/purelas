
var mapAPIKey = "AIzaSyAgQ3Td8h6homy1Hf2MIT9DUR9882g-42Q"

var map = null
var route = null
var reportEditMap = null
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

  console.log('initMap', currentLatLng)

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    disableDefaultUI: true,
  });

  map.data.setStyle(function(feature)
  {

    return
    {
      icon: getCircle()
    };

  });

  if ( currentLatLng != null )
  {
    try
    {
      console.log( typeof currentLatLng, currentLatLng.lat, currentLatLng.lng )
      map.setCenter( currentLatLng )
    } catch( e ){ console.error( e, currentLatLng ) }

  }

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
