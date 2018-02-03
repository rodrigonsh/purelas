var currentPosition = [ -20.4670068, -54.6222753 ]
var currentLatLng = { lat: -20.4670068, lng: -54.6222753 };

function gotPosition(pos)
{
  currentPosition = [pos.coords.latitude, pos.coords.longitude];
  currentLatLng = { lat:pos.coords.latitude, lng: pos.coords.longitude }
  emit('gotPosition', JSON.stringify(currentLatLng));
}

function noPosition()
{
  console.log("no Position... shit");
}

navigator.geolocation.watchPosition(
  gotPosition,
  noPosition
  )
