$loginForm = q("#loginPage form")

$loginForm.addEventListener('submit', function(ev){

  ev.preventDefault();
  ev.stopPropagation();

  $loginForm.classList.remove('failed')
  $loginForm.classList.add('processing')

  var email = $loginForm.querySelector('[type=email]').value
  var password = $loginForm.querySelector('[type=password]').value

  login( email, password );

})

addEventListener('authError', function(ev)
{

  $loginForm.classList.remove('processing');
  $loginForm.classList.add('failed')

  // TODO: set message from firebase-errors.js

})

addEventListener('loginBefore', function(){

  if ( UID == null )
  {
    setPage('login')
  }

})
