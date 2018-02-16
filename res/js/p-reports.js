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
