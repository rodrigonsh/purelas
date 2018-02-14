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

  navigator.geolocation.getCurrentPosition(
    gotPosition,
    noPosition)

  return true
  
}

function gotPosition(pos)
{
  currentPosition = [pos.coords.latitude, pos.coords.longitude];
  currentLatLng = { lat:pos.coords.latitude, lng: pos.coords.longitude }
  emit('gotPosition', currentLatLng);
}

function noPosition()
{
  alert("Erro ao obter localização por GPS");
  emit('noPosition')
}

setTimeout( getCoords, 10000 )
