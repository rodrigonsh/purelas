var error = null;
var $errorPage = q("#errorPage")

addEventListener('err', function(ev)
{

  console.log('error', ev)

  ev.stopPropagation()
  ev.preventDefault()

  if ( ! 'data' in ev ) return;

  error =
  {
    kind: ev.data.kind,
    err: ev.data.err,
    uid: UID
  }

  console.log( 'error! borasalvar?', error )

  $errorPage.classList.remove('failed')
  $errorPage.classList.remove('successful')
  $errorPage.classList.add('processing')

  db.ref('errors').child( new Date().valueOf() ).set( error )
    .then( function()
    {
      $errorPage.classList.remove('processing')
      $errorPage.classList.add('successful')
      toast("O erro foi registrado")
      return true
    }, function(msg)
    {
      $errorPage.classList.remove('processing')
      $errorPage.classList.add('failed')
      $errorPage.querySelector('error-type').textContent = error.type
      $errorPage.querySelector('error-msg').textContent = error.err
      return false
    })

    setPage('error')

})
