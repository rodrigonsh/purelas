var geofireRef = db.ref('geofire')
var reportsRef = db.ref('reports')

var geoFire = new GeoFire(geofireRef);

var geoInfos = {}
var reports = {}

var geoQuery = geoFire.query({
  center: [0,0],
  radius: 5,
});

// Attach event callbacks to the query

var onKeyEnteredRegistration = geoQuery.on("key_entered", function(key, location, distance) {

  key = parseInt(key)

  console.log(key + " entered the query. Hi " + key + "!", distance);

  reportsRef.child( key )
    .on('value', function(s)
    {
      reports[ key ] = s.val()
      emit('reportsChanged')
    })


  geoInfos[ key ] = { d: distance, l: location }


});

var onKeyExitedRegistration = geoQuery.on("key_exited", function(key, location) {

  key = parseInt(key)

  console.log(key + " migrated out of the query. Bye bye :(");

  delete reports[ key ]
  delete geoInfos[ key ]

  emit('reportsChanged')
  localStorage.setItem('reports', JSON.stringify( reports ))

});

var onKeyMovedRegistration = geoQuery.on("key_moved", function(key, location, distance) {
  key = parseInt(key)
  geoInfos[ key ] = { d: distance, l: location }
  emit('reportsChanged')
});


addEventListener('gotPosition', function(ev)
{
  console.log('atualizando criterio geoQuery')
  geoQuery.updateCriteria({ center: currentPosition })
})
