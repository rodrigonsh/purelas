var reportViewMarker = null

var $viewReportText = q("#viewReportPage #report")
var $viewReportAgressor = q("#viewReportPage #agressor")
var $viewReportDate = q("#viewReportPage #published_at")

$reportViewMap = q("#report-view-map")

$reportViewMap.addEventListener('touchmove', function(ev){
  ev.stopPropagation()
})

addEventListener('reportsView', function(ev)
{

  if( mapsReady && reportViewMap == null )
  {
    emit('reportViewMapRender')
  }

  if( !mapsReady && reportViewMap == null )
  {
    // enqueue rendering
    renderMap = 'reportViewMap'
  }

  var target = ev.data
  console.log(target)

  if ( target.nodeName != "card" )
  {
    target = target.parentNode
  }

  ts = parseInt( target.getAttribute('id') )

  var rep = reports[ts]

  $viewReportText.textContent = rep.report
  $viewReportAgressor.textContent = rep.agressor
  $viewReportDate.textContent = moment(ts).format("LL")

  reportViewMap.setCenter( makeLatLng(geoInfos[ts].l) )

  if ( reportViewMarker == null )
  {

    reportViewMarker = new google.maps.Marker({
      position: makeLatLng(geoInfos[ts].l),
      map: reportViewMap
    })

  }

  else
  {
    reportViewMarker.setPosition( makeLatLng(geoInfos[ts].l) )
  }

  setPage('report-view')

})

addEventListener('reportViewMapRender', function()
{
  reportViewMap = new google.maps.Map(
    document.getElementById('report-view-map'), {
    zoom: 14,
    center: currentLatLng
  })
})
