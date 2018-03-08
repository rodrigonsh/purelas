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
  currentGeoQuery = { center: [0,0], radius: 0 }
}

emit('reportsChanged')

var reportsGeoQuery = reportsGeoFire.query( currentGeoQuery );

addEventListener('adminSet', function(ev)
{

  console.log('adminSet', admin)

  if (admin)
  {
    console.log( 'adminSet: currentPage: ', currentPage )
    reportsGeoQuery.updateCriteria({ radius: 5000 })


    if( currentPage.dataset.page == 'login' )
    {
      console.log('oie ae')
      setPage('overview')
    }
    else( console.log('entonce?') )
  }

})





// Attach event callbacks to the query

var onKeyEnteredRegistration = reportsGeoQuery.on("key_entered", function(key, location, distance) {

  console.log(key, "entered the query. Hi!", distance);

  db.ref( 'messages/'+key )
    .on('child_added', function(s)
    {

      var val = s.val()
      var ts = parseInt(s.key)
      console.log('child_added', key, ts, val.text)

      if ( messages[key] == undefined )
      {
        messages[key] = {}
      }

      messages[key][ts] = val

      if
      (
        ( undefined == messagesTimestamps[ key ] ) ||
        ( ts >  messagesTimestamps[ key ] )
      )
      {
        messagesTimestamps[ key ] = ts
      }

      console.log(messages, messagesTimestamps)
      emit('messagesReady')

    })

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

  if( !admin ) return;

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

$messagesForm = q('#messagesPage form')
$messagesContainer = q('#messagesPage #messagesContainer')

var messages = {}
var messagesTimestamps = {}
var currentChat = null

emit("messagesReady")

var $contactsList = q('#contactsList')
var $contactMessages = q('#contactMessages')

$contactsList.addEventListener('click', function(ev)
{
  currentChat = ev.target.dataset.uid
  emit('messagesReady')
})

addEventListener('messagesReady', function(ev)
{

  $contactsList.innerHTML = ""
  $contactMessages.innerHTML = ""

  tsKeys = Object.keys( messagesTimestamps )
  tsValues = Object.values( messagesTimestamps )

  console.log('tsKeys', tsKeys)
  console.log('tsValues', tsValues)

  for( var i = 0; i < tsKeys.length; i++ )
  {
    var uid =  tsKeys[i]
    var timestamp = messagesTimestamps[uid]

    var li = document.createElement('li')
    var liCard = document.createElement('card')
    liCard.textContent = uid

    liCard.dataset.uid = uid

    $contactsList.appendChild( liCard )

    if ( currentChat == uid )
    {

      liCard.setAttribute('active', true)

      var keys = Object.keys( messages[uid] )
      console.log(keys)

      for( var j = 0; j < keys.length; j++ )
      {

        console.log(j)

        var card = document.createElement('card')
        if ( UID == messages[uid][ keys[j] ].user )
        {
          card.setAttribute( 'mine', true )
        }

        var p = document.createElement('p')
        p.textContent = messages[uid][ keys[j] ].text

        var date = document.createElement('date')
        date.setAttribute('value', keys[i])
        date.textContent = moment( parseInt(keys[j]) ).format( "LL" )

        card.appendChild( p )
        card.appendChild( date )

        $contactMessages.appendChild(card)

      }

      $contactMessages.scrollTop = 9999999;


    }



  }

})

$messagesForm.addEventListener('submit', function(ev)
{
  ev.stopPropagation()
  ev.preventDefault()

  var message =
  {
    text: $messagesForm.querySelector('input').value.trim(),
    user: UID,
    read: false
  }

  if ( message.text == "")
  {
    return;
  }

  $messagesForm.querySelector('input').value = ""

  db.ref('messages/'+currentChat).child( new Date().valueOf() ).set( message )
    .then( function(){ console.log('messageSet') } )
    .catch( function(msg){ console.log('error', msg) }  )

})

addEventListener('messagesBefore', function()
{
  setPage('messages')
})

addEventListener('messagesAfter', function()
{
  console.log($messagesContainer.offsetHeight)
  $contactMessages.style.height = $messagesContainer.offsetHeight - 83+"px"
  $contactsList.style.height = $messagesContainer.offsetHeight+"px"
})

$map = q("#map")

$map.addEventListener('touchmove', function(ev){
  ev.stopPropagation()
})

var markersArray = []

addEventListener('overviewBefore', function(){

  setPage('overview')

})


addEventListener('gotPosition', function(ev)
{
  if (mapsReady)
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

addEventListener('partnersBefore', function(){

  setPage('partners')

})

addEventListener('phonesBefore', function(){

  setPage('phones')

})

addEventListener('rateBefore', function(){

  setPage('rate')

})

var currentReport = null;

var reportViewMarker = null

var $viewReportAddress = q("#viewReportPage #address")
var $viewReportText = q("#viewReportPage #report")
var $viewReportAgressor = q("#viewReportPage #agressor")
var $viewReportDate = q("#viewReportPage #published_at")

$reportViewMap = q("#report-view-map")

$reportViewMap.addEventListener('touchmove', function(ev){
  ev.stopPropagation()
})

addEventListener('reportsView', function(ev)
{
  var target = ev.data
  console.log(target.nodeName)

  if ( target.nodeName != "CARD" )
  {
    target = target.parentNode
  }

  console.log( target, target.getAttribute('id') )

  ts = parseInt( target.getAttribute('id') )

  currentReport = reports[ts]

  if( mapsReady && reportViewMap == null )
  {
    emit('reportViewMapRender')
  }

  if( !mapsReady && reportViewMap == null )
  {
    // enqueue rendering
    renderMap = 'reportViewMap'
  }



  $viewReportAddress.textContent = currentReport.address
  $viewReportText.textContent = currentReport.report
  $viewReportAgressor.textContent = currentReport.agressor
  $viewReportDate.textContent = moment(ts).format("LL")

  setPage('report-view')

})

addEventListener('reportViewMapRender', function()
{

  reportViewMap = new google.maps.Map(
    document.getElementById('report-view-map'), {
    zoom: 14,
    center: makeLatLng(currentReport.coords)
  })

  if ( reportViewMarker == null )
  {

    reportViewMarker = new google.maps.Marker({
      map: reportViewMap
    })

  }

  reportViewMarker.setPosition( makeLatLng( currentReport.coords ) )

})

$reportsPage = q("#reportsPage")
$reportsList = q("#reportsPage [data-action=view]")


addEventListener('reportsBefore', function(){

  var keys = Object.keys( geoInfos )
  if ( keys.length == 0  ) $reportsPage.classList.add('nodata')
  else $reportsPage.classList.remove('nodata')

  setPage('reports')

})


addEventListener('reportsChanged', function()
{

  $reportsList.innerHTML = ""

  var timestamps = Object.keys( reports )
  timestamps.reverse()

  for( var i=0; i < timestamps.length; i++ )
  {

    console.log( timestamps[i] )

    var card = document.createElement('card')
    card.setAttribute('id', timestamps[i])
    card.setAttribute('chevron', true)

    var addr = document.createElement('address')
    addr.textContent = reports[ timestamps[i] ].address

    var p = document.createElement('p')
    p.textContent = reports[ timestamps[i] ].report.substr(0, 90)+"..."

    var date = document.createElement('date')
    date.setAttribute('value', timestamps[i])
    date.textContent = moment( parseInt(timestamps[i]) ).format( "LL" )

    card.appendChild(addr)
    card.appendChild(p)
    card.appendChild(date)

    $reportsList.appendChild(card)

  }

  if ( timestamps.length == 0 ) $reportsPage.classList.add('nodata')
  else $reportsPage.classList.remove('nodata')

  if ( timestamps.length < 3 ) $reportsPage.classList.add('show-cat')
  else $reportsPage.classList.remove('show-cat')

})

$routeForm = q("#routePage form");
$routeForm.addEventListener('submit', function(ev)
{

  $routeForm.classList.remove('error')
  $routeForm.classList.add('processing')

  ev.stopPropagation()
  ev.preventDefault()

  var mode = q("#routePage [data-mode][on]").dataset.mode

  if ( 'Keyboard' in window )
  {
    Keyboard.hide()
  }

  var req = {
    origin: q("#routePage [name=origem]").value,
    destination: q("#routePage [name=destino]").value,
    travelMode: mode,
    region: 'BR'
  }

  try {

    directionsService.route(req, function(response, status) {

      $routeForm.classList.remove('processing')
      console.log( status, response )

      if (status == 'OK')
      {
        directionsDisplay.setDirections(response);
        setPage('map')
      }

      else
      {
        $routeForm.classList.add('error')        
      }

    });

  } catch (e) {

    $routeForm.classList.remove('processing')
    $routeForm.classList.add('failed')

    $routeForm.querySelector('.error strong').textContent = e.message

  }

})

addEventListener('routeBefore', function(){

  setPage('route')

})

$("#routePage [data-mode]").on('tap', function(ev)
{
  $("[data-mode]").attr('on', null)
  ev.currentTarget.setAttribute('on', 'on')
})

addEventListener('supportBefore', function(){

  setPage('support')

})


var $navigator = document.getElementById('navigator');

if ( localStorage.getItem('welcome') == null )
{
  emit('welcomeBefore')
}
else
{
  emit('overviewBefore')
}

setTimeout(function(){
  $("#splash").addClass('hiding');
}, 1500)

setTimeout(function(){
  $("#splash").addClass('hidden');
}, 2500)


function onLoad()
{

  console.log('onLoad')

}

var ignited = false

document.addEventListener('deviceready', function()
{

  if ( ignited ) return

  ignited = true
  console.log('deviceready')

  if ('splashscreen' in navigator)
  {
    navigator.splashscreen.hide()
  }


})

setTimeout(function()
{
  var e = new Event('deviceready')
  document.dispatchEvent(e)
}, 10000)
