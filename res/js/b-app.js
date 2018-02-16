var $app = $('#app')[0]

addEventListener('online', function()
{
  $app.classList.remove('offline')
})

addEventListener('offline', function()
{
  $app.classList.add('offline')
})

addEventListener('userSet', function()
{
  if ( currentUser != null )
  {
    $app.classList.add('logged')
  } else {
    $app.classList.remove('logged')
  }

})

$("#splash").addClass('show');
