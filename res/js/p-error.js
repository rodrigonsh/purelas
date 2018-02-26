var error = null;
var $errorPage = q("#errorPage")
var $errorMsg = q("#errorPage error-msg")

function shouldUpdateErrorUI()
{

  console.log('shouldUpdateErrorUI')
  $errorPage.classList.remove('processing')
  $errorPage.classList.add('successful')
  toast("O erro foi registrado")

  return Promise.resolve( "OIe" )

}

addEventListener('error', function(ev)
{

  ev.stopPropagation()
  ev.preventDefault()

  if ( ! 'data' in ev || ev.data == undefined ) return console.error('wha?',ev);

  error =
  {
    kind: ev.data.kind,
    err: ev.data.err,
    uid: UID
  }


  if ( error.err.code in errMessages )
  {
    $errorMsg.textContent = errMessages[error.err.code]
  }
  else
  {
    $errorMsg.textContent = error.err.message
  }

  $errorPage.classList.remove('failed')
  $errorPage.classList.remove('successful')
  $errorPage.classList.add('processing')



  /*.then( function()
  {

  })*/

  console.log( 'error! borasalvar?', error )

  var ts = new Date().valueOf().toString()

  db.ref('errors/'+ts)
    .set( error )
    //.then( shouldUpdateErrorUI )
    .catch(function(msg)
    {
      console.log('catched!')
      $errorPage.classList.remove('processing')
      $errorPage.classList.add('failed')
      $errorPage.querySelector('error-type').textContent = error.type
      $errorPage.querySelector('error-msg').textContent = error.err
    })

    console.log( 'mandei...' )

    setPage('error')

})
