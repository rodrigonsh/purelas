addEventListener('reportsBefore', function(){

  setPage('reports')

})

$reportsList = q("#reportsPage [data-action=view]")

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

})
