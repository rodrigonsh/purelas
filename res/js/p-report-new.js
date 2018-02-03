var $reportNewForm = q('#newReportPage form')
var $reportNewGeocode = q('#newReportPage [name=geocode]')
var $reportNewText = q('#newReportPage [name=report]')
var $reportNewAgressor = q('#newReportPage [name=agressor]')
var reportNewMarker= null
var reportNewCoords = null

addEventListener('report-newBefore', function(){

  $reportNewGeocode.focus()

  if ( mapsReady && reportNewMap == null )
  {
    emit('reportNewMapRender')
  }

  if( !mapsReady && reportNewMap == null )
  {
    // enqueue rendering
    renderMap = 'reportNewMap'
  }


  reportNewCoords = null
  $reportNewGeocode.value = ""
  $reportNewText.value = ""
  $reportNewAgressor.value = ""

  setPage('report-new')

})


addEventListener('reportNewMapRender', function()
{
  reportNewMap = new google.maps.Map(
    document.getElementById('report-new-map'), {
      zoom: 14,
      center: currentLatLng
    })
})


var geocodeURI = "https://maps.googleapis.com/maps/api/geocode/json"

geocodeXHR = new XMLHttpRequest()
geocodeXHR.onload = function()
{

  var res = JSON.parse(geocodeXHR.responseText)

  if ( res.status != "OK" )
  {
    alert('erro no geocoding')
    return
  }

  reportNewCoords = res.results[0].geometry.location

  reportNewMap.setCenter( reportNewCoords )

  if ( reportNewMarker == null )
  {

    reportNewMarker = new google.maps.Marker({
      position: reportNewCoords,
      map: reportNewMap
    })

  }

  else
  {
    reportNewMarker.setPosition( reportNewCoords )
  }



}


$reportNewGeocode.addEventListener('keyup', debounce(function() {

  console.log('geocoding', $reportNewGeocode.value)

  var params = [
    geocodeURI,
    "?address=", $reportNewGeocode.value,
    "&key=", mapAPIKey
  ]

  var uriParams = params.join('')

  geocodeXHR.open( "GET", encodeURI(uriParams) )
  geocodeXHR.send()

}, 1000))

function reportNewBeforeSave()
{

  console.log( 'shall we save?' )

  if ( reportNewCoords == null )
  {
    alert("Endereço sem coordenadas!")
    return
  }

  var timestamp = new Date().valueOf()

  var rep =
  {
    address: $reportNewGeocode.value,
    report: $reportNewText.value,
    agressor: $reportNewAgressor.value,
    uid: UID,
    coords: reportNewCoords
  }


  var req = new XMLHttpRequest();
  req.onload = function()
  {
    console.log('req onload', req.responseText)
  }

  var url = "https://us-central1-purelas-190223.cloudfunctions.net/sendReport"

  req.open('POST', url, true);
  req.setRequestHeader('Content-Type', 'application/json');
  req.send(JSON.stringify(rep));

  // TODO: adicionar index no firebase

  setPage('thanks')

}

$reportNewForm.addEventListener('submit', function(ev)
{

  ev.stopPropagation()
  ev.preventDefault()

  reportNewBeforeSave()

})

addEventListener('report-newSave', reportNewBeforeSave)
