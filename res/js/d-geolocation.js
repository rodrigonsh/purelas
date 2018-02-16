var currentPosition = JSON.parse(localStorage.getItem('currentPosition'))
var currentLatLng = JSON.parse(localStorage.getItem('currentLatLng'))

if ( currentPosition == null )
{

  currentPosition = [-20.4670068, -54.6222753]
  currentLatLng = { lat: -20.4670068, lng: -54.6222753 }

}


function gotPosition(pos)
{
  currentPosition = [pos.coords.latitude, pos.coords.longitude];
  currentLatLng = { lat:pos.coords.latitude, lng: pos.coords.longitude }

  localStorage.setItem('currentPosition', JSON.stringify(currentPosition))
  localStorage.setItem('currentLatLng', JSON.stringify(currentLatLng))

  emit('gotPosition', currentLatLng);
}

function noPosition()
{
  toast('Erro ao obter sua localização, por favor ative seu GPS')
}

var watchPosition = navigator.geolocation.watchPosition(
  gotPosition,
  noPosition,
  { timeout: 30000 })
