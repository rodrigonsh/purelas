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
