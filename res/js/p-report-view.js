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
