$routeForm = q("#routePage form");
$routeForm.addEventListener('submit', function(ev)
{

  $routeForm.classList.remove('error')
  $routeForm.classList.add('processing')

  ev.stopPropagation()
  ev.preventDefault()

  var mode = q("#routePage [data-mode][on]").dataset.mode

  if ( 'Keyboard' in window )
  {
    Keyboard.hide()
  }

  var req = {
    origin: q("#routePage [name=origem]").value,
    destination: q("#routePage [name=destino]").value,
    travelMode: mode,
    region: 'BR'
  }

  try {

    directionsService.route(req, function(response, status) {

      $routeForm.classList.remove('processing')
      console.log( status, response )

      if (status == 'OK')
      {
        directionsDisplay.setDirections(response);
        setPage('map')
      }

      else
      {
        $routeForm.classList.add('error')        
      }

    });

  } catch (e) {

    $routeForm.classList.remove('processing')
    $routeForm.classList.add('failed')

    $routeForm.querySelector('.error strong').textContent = e.message

  }

})

addEventListener('routeBefore', function(){

  setPage('route')

})

$("#routePage [data-mode]").on('tap', function(ev)
{
  $("[data-mode]").attr('on', null)
  ev.currentTarget.setAttribute('on', 'on')
})
