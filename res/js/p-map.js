$map = q("#map")
$map.addEventListener('touchmove', function(ev){
  ev.stopPropagation()
})

var markersArray = []

addEventListener('mapBefore', function(){

  setPage('map')

})


addEventListener('gotPosition', function(ev)
{
  map.setCenter( currentLatLng )
})

addEventListener('reportsChanged', function(ev)
{
  // plot markers and shit
  for( var i=0; i<markersArray.length; i++ )
  {
    markersArray[i].setMap(null);
  }

  var keys = Object.keys( geoInfos )
  for( var i=0; i<keys.length; i++ )
  {

    pos = { lat: geoInfos[keys[i]].l[0], lng: geoInfos[keys[i]].l[1] }

    var m = new google.maps.Marker({
      position: pos,
      map: map,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: '#904f98',
        fillOpacity: .8,
        scale: 20,
        strokeColor: '#904f98',
        strokeWeight: .5
      }
    })

    markersArray.push(m)

  }

})
