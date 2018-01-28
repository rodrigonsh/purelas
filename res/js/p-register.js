$registerForm = q("#registerPage form")

addEventListener('registerAfter',  function()
{
  $registerForm.querySelector('[type=email]').value = ""
  $("registerPage form [type=password]").val("")
})

$registerForm.addEventListener('submit', function(ev){

  ev.preventDefault();
  ev.stopPropagation();

  var email = $registerForm.querySelector('[type=email]').value

  var senhas = $registerForm.querySelectorAll('[type=password]')
  if( senhas[0].value != senhas[1].value )
  {
    alert("As senhas devem coincidir")
    return
  }
  else
  {
    $registerForm.classList.add('processing')
    register( email, senhas[0].value )
  }



})

addEventListener('registerError', function(ev)
{

  $registerForm.classList.remove('processing')
  $registerForm.classList.add('failed')

  // TODO: set error message from firebase-errors.js

})

addEventListener('registerBefore', function(){

  if ( UID == null )
  {
    setPage('register')
  }

})
