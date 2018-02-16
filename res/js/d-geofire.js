var reportsGeoFireRef = db.ref('geoReports')
var reportsRef = db.ref('reports')

var reportsGeoFire = new GeoFire(reportsGeoFireRef);
var geoInfos = JSON.parse(localStorage.getItem('geoInfos'))

var currentGeoQuery = JSON.parse(localStorage.getItem('currentGeoQuery'))
var reports = JSON.parse(localStorage.getItem('reports'))

if ( geoInfos == null ) geoInfos = {}
if ( reports == null ) reports = {}
if ( currentGeoQuery == null )
{
  currentGeoQuery = { center: [0,0], radius: 50 }
}

var reportsGeoQuery = reportsGeoFire.query( currentGeoQuery );

// Attach event callbacks to the query

var onKeyEnteredRegistration = reportsGeoQuery.on("key_entered", function(key, location, distance) {

  console.log(key, "entered the query. Hi!", distance);

  reportsRef.child( key )
    .on('value', function(s)
    {

      var val = s.val()

      if ( val != null )
      {

        val.k = key
        var ts = val.timestamp
        delete val.timestamp

        geoInfos[ key ].timestamp = ts
        reports[ ts ] = val

        localStorage.setItem('reports', JSON.stringify(reports))

        emit('reportsChanged')

      }

    })


  geoInfos[ key ] = { d: distance, l: location }
  emit('geoInfosChanged')

});

var onKeyExitedRegistration = reportsGeoQuery.on("key_exited", function(key, location) {

  console.log(key + " migrated out of the query. Bye bye :(");

  delete reports[ geoInfos[key].timestamp ]
  delete geoInfos[ key ]

  emit('reportsChanged')
  emit('geoInfosChanged')

});

var onKeyMovedRegistration = reportsGeoQuery.on("key_moved", function(key, location, distance) {

  geoInfos[ key ].distance = distance
  geoInfos[ key ].location = location

  emit('reportsChanged')
  emit('geoInfosChanged')

});


addEventListener('gotPosition', function(ev)
{
  console.log('atualizando criterio geoQuery')

  currentGeoQuery.center = currentPosition
  reportsGeoQuery.updateCriteria(currentGeoQuery)

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
