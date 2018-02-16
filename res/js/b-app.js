var $app = $('#app')[0]

addEventListener('online', function()
{
  $app.classList.remove('offline')
})

addEventListener('offline', function()
{
  console.log('should add offline class')
  $app.classList.add('offline')
  console.assert($app.classList.contains('offline'))
})

addEventListener('userSet', function()
{
  if ( currentUser != null )
  {
    $app.classList.add('logged')
  } else {
    console.log('not logged')
    $app.classList.remove('logged')
  }

})

$("#splash").addClass('show');
