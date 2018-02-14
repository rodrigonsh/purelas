var currentPosition = localStorage.getItem('currentPosition')
var currentLatLng = localStorage.getItem('currentLatLng')

if ( currentPosition == null )
{

  currentPosition = [-20.4670068, -54.6222753]
  currentLatLng = { lat: -20.4670068, lng: -54.6222753 };

  getCoords()

}

function getCoords()
{

  emit('getPosition')

  navigator.geolocation.watchPosition(
    gotPosition,
    noPosition)

  return true

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
  emit('noPosition')
}

setTimeout( getCoords, 10000 )
