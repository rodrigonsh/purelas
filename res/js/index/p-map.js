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
  if (map)
  {
    map.setCenter( currentLatLng )
  }
})

addEventListener('reportsChanged', function(ev)
{
  // clear markers
  for( var i=0; i<markersArray.length; i++ )
  {
    markersArray[i].setMap(null);
    delete markersArray[i]
  }

  var keys = Object.keys( reports )
  for( var i=0; i<keys.length; i++ )
  {

    var rep = reports[keys[i]]

    var m = new google.maps.Marker({
      position: makeLatLng( rep.coords ),
      map: map,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: '#904f98', //TODO: color code
        fillOpacity: .8,
        scale: 20, // TODO: scale according to recency
        strokeColor: '#904f98',
        strokeWeight: .5
      }
    })

    markersArray.push(m)

    while ( 'before' in rep )
    {

      rep = rep.before

      var m = new google.maps.Marker({
        position: makeLatLng( rep.coords ),
        map: map,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: '#904f98', //TODO: color code
          fillOpacity: .8,
          scale: 20, // TODO: scale according to recency
          strokeColor: '#904f98',
          strokeWeight: .5
        }
      })

      markersArray.push(m)

    }

  }

})
