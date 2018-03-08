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

emit('reportsChanged')

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


var userReport = JSON.parse( localStorage.getItem('userReport') )
var userReportRef = null;

function resetuserReport()
{
  userReport = {
    type: '',
    address: '',
    report: '',
    agressor: '',
    timestamp: new Date().valueOf(),
    coords: [0,0]
  }
}

if ( userReport == null ) resetuserReport()


addEventListener('userSet', function()
{
  if ( UID == null ) return

  userReportRef = db.ref( '/reports/'+UID )
  userReportRef.on('value', function(s)
  {

    if ( s.val() == null ) resetuserReport()
    else userReport = s.val()

    localStorage.setItem( 'userReport' , JSON.stringify( userReport ) )

  })

})

addEventListener("termsShow", function()
{

  var $termsModal = q("#termsModal")
  $termsModal.addEventListener("touchmove", function(ev){
    ev.stopPropagation()
  })

})

$contactForm = q('#contactPage form')

var messages = JSON.parse( localStorage.getItem('messages') )
if ( messages == null ) messages = {}

emit("messagesReady")

var messagesRef = null;

addEventListener('userSet', function()
{
  if ( UID == null ) return
  messagesRef = db.ref('messages/'+UID)
  messagesRef.on('value', function(snap)
{

  if( snap.val() ==  null ) messages = {}
  else messages = snap.val()

  localStorage.setItem('messages', JSON.stringify( messages ))
  emit('messagesReady')

})
})

var $contactMessages = q('#contactMessages')


addEventListener('messagesReady', function(ev)
{

  $contactMessages.innerHTML = ""
  var keys = Object.keys( messages )
  for( var i = 0; i < keys.length; i++ )
  {

    var card = document.createElement('card')
    if ( UID == messages[ keys[i] ].user )
    {
      card.setAttribute( 'mine', true )
    }

    var p = document.createElement('p')
    p.textContent = messages[ keys[i] ].text

    var date = document.createElement('date')
    date.setAttribute('value', keys[i])
    date.textContent = moment( parseInt(keys[i]) ).format( "LL" )

    card.appendChild( p )
    card.appendChild( date )

    $contactMessages.appendChild(card)

  }

})

$contactForm.addEventListener('submit', function(ev)
{
  ev.stopPropagation()
  ev.preventDefault()

  var message =
  {
    text: $contactForm.querySelector('input').value.trim(),
    user: UID,
    read: false
  }

  if ( message.text == "")
  {
    return;
  }

  $contactForm.querySelector('input').value = ""

  db.ref('messages/'+UID).child( new Date().valueOf() ).set( message )
    .then( function(){ console.log('messageSet') } )
    .catch( function(msg){ console.log('error', msg) }  )

})

addEventListener('contactBefore', function(){

  setPage('contact')

})

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

$opinionForm = q('#opinionPage form')

$opinionForm.addEventListener('submit', function(ev)
{
  ev.stopPropagation()
  ev.preventDefault()

  var opinion =
  {
    text: $opinionForm.querySelector('textarea').value.trim(),
    uid: UID
  }

  if ( opinion.text == "")
  {
    alert('Opinião deve ser preenchida')
    return;
  }

  console.log( 'borasalvar?', opinion )

  db.ref('opinions').child( new Date().valueOf() ).set( opinion )
    .then( function(){ return Promise.resolve( () => emit('thanks', 'opinion') ) } )
    .catch( function(msg){ emit("error", {kind:"opinion", err:msg} ) } )

})

addEventListener('opinionBefore', function(){

  setPage('opinion')

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

var $reportEditForm = q('#reportEditPage form')
var $reportEditType = q('#reportEditPage [name="type"]')
var $reportEditGeocode = q('#reportEditPage [name=geocode]')
var $reportEditMapWr = q('#reportEditPage #report-edit-map')
var $reportEditText = q('#reportEditPage [name=report]')
var $reportEditAgressor = q('#reportEditPage [name=agressor]')
var reportEditMarker= null
var reportEditCoords = null

$reportEditMap = q("#report-edit-map")

$reportEditMap.addEventListener('touchmove', function(ev){
  ev.stopPropagation()
})

addEventListener('report-editBefore', function()
{

  if ( localStorage.getItem('onboard') == null )
  {
    return emit('onboardingBefore')
  }

  if ( mapsReady && reportEditMap == null )
  {
    emit('reportEditMapRender')
  }

  if( !mapsReady && reportEditMap == null )
  {
    // enqueue rendering
    renderMap = 'reportEditMap'
  }

  reportEditCoords = makeLatLng(userReport.coords)
  $reportEditType.value = userReport.type
  $reportEditGeocode.value = userReport.address
  $reportEditText.value = userReport.report
  $reportEditAgressor.value = userReport.agressor

  setPage('report-edit')

})


addEventListener('reportEditMapRender', function()
{

  console.log('HEY! reportEditMapRender', reportEditMarker)

  reportEditMap = new google.maps.Map(
    document.getElementById('report-edit-map'), {
      zoom: 14,
      center: makeLatLng(userReport.coords)
    })

    if ( reportEditMarker == null )
    {

      reportEditMarker = new google.maps.Marker({
        map: reportEditMap
      })

      /*if ( userReport != null )
      {
      }*/

    }

    reportEditMarker.setPosition( makeLatLng(userReport.coords) )

})


var geocodeURI = "https://maps.googleapis.com/maps/api/geocode/json"

geocodeXHR = new XMLHttpRequest()
geocodeXHR.onload = function()
{

  $reportEditMapWr.classList.remove('loading')

  var res = JSON.parse(geocodeXHR.responseText)

  if ( res.status != "OK" )
  {
    reportEditCoords = null
    alert('Endereço não retornou coordenadas! Envie um endereço válido')
    return
  }

  reportEditCoords = res.results[0].geometry.location

  reportEditMap.setCenter( reportEditCoords )
  reportEditMarker.setPosition( reportEditCoords )

}


$reportEditGeocode.addEventListener('keyup', debounce(function() {

  if ( $reportEditGeocode.value.trim() == "" ) return;

  console.log('geocoding', $reportEditGeocode.value)

  var params = [
    geocodeURI,
    "?address=", $reportEditGeocode.value,
    "&key=", mapAPIKey
  ]

  var uriParams = params.join('')

  geocodeXHR.open( "GET", encodeURI(uriParams) )
  geocodeXHR.send()

  $reportEditMapWr.classList.add('loading')

}, 1000))

function reportEditBeforeSave()
{

  $reportEditType.blur()
  $reportEditGeocode.blur()
  $reportEditText.blur()
  $reportEditAgressor.blur()

  console.log( 'shall we save?' )

  if ( reportEditCoords == null )
  {
    alert("Endereço inválido!  Você deve informar um endereço válido")
    return
  }

  var timestamp = new Date().valueOf()
  coords = [ reportEditCoords.lat, reportEditCoords.lng ]

  var rep =
  {
    type: $reportEditType.value,
    address: $reportEditGeocode.value,
    report: $reportEditText.value,
    agressor: $reportEditAgressor.value,
    timestamp: timestamp,
    coords: coords,
    before: userReport
  }

  reportsRef.child( UID ).set( rep )
  reportsGeoFire.set( UID, coords )

  emit('thanks', 'report')

  // TODO: save report to upload in case of no internet

}

$reportEditForm.addEventListener('submit', function(ev)
{

  ev.stopPropagation()
  ev.preventDefault()

  reportEditBeforeSave()

})

addEventListener('report-editSave', reportEditBeforeSave)

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


if ( localStorage.getItem('welcome') == null )
{
  emit('welcomeBefore')
}
else
{
  setPage('map')
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
  navigator.splashscreen.hide()

})

setTimeout(function()
{
  var e = new Event('deviceready')
  document.dispatchEvent(e)
}, 10000)
