var geofireRef = db.ref('geofire')
var reportsRef = db.ref('reports')

var geoFire = new GeoFire(geofireRef);

var geoInfos = JSON.parse(localStorage.getItem('geoInfos'))
var currentGeoQuery = JSON.parse(localStorage.getItem('currentGeoQuery'))
var reports = JSON.parse(localStorage.getItem('reports'))

if ( geoInfos == null ) geoInfos = {}
if ( reports == null ) reports = {}
if ( currentGeoQuery == null )
{
  currentGeoQuery = { center: [0,0], radius: 50 }
}

var geoQuery = geoFire.query( currentGeoQuery );

// Attach event callbacks to the query

var onKeyEnteredRegistration = geoQuery.on("key_entered", function(key, location, distance) {

  key = parseInt(key)

  console.log(key + " entered the query. Hi " + key + "!", distance);

  reportsRef.child( key )
    .on('value', function(s)
    {
      reports[ key ] = s.val()
      localStorage.setItem('reports', JSON.stringify(reports))
      emit('reportsChanged')
    })


  geoInfos[ key ] = { d: distance, l: location }
  emit('geoInfosChanged')

});

var onKeyExitedRegistration = geoQuery.on("key_exited", function(key, location) {

  key = parseInt(key)

  console.log(key + " migrated out of the query. Bye bye :(");

  delete reports[ key ]
  delete geoInfos[ key ]

  emit('reportsChanged')
  emit('geoInfosChanged')

});

var onKeyMovedRegistration = geoQuery.on("key_moved", function(key, location, distance) {
  key = parseInt(key)
  geoInfos[ key ] = { d: distance, l: location }
  emit('reportsChanged')
  emit('geoInfosChanged')
});


addEventListener('gotPosition', function(ev)
{
  console.log('atualizando criterio geoQuery')

  currentGeoQuery.center = currentPosition
  geoQuery.updateCriteria(currentGeoQuery)

  localStorage.setItem( 'currentGeoQuery', JSON.stringify(currentGeoQuery) )

})

addEventListener('reportsChanged', function(ev)
{
  localStorage.setItem('reports', JSON.stringify( reports ))
})

addEventListener('geoInfosChanged', function(ev)
{
  localStorage.setItem('geoInfos', JSON.stringify( geoInfos ))
})
