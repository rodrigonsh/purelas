addEventListener('userNew', function()
{

  var userData = {
    name: "Seu nome",
    registered_at: new Date().valueOf(),
    logged_at: new Date().valueOf()
  }

  emit('userEdit')

})

addEventListener('userSet', function(ev)
{
  if ( currentUser == null )
  {
    $("#menu header p").html("Visitante")
    $("#menu header small").html("Usuário Anônimo")
  }

  else
  {
    $("#menu header small").html(currentUser.email)
    $("#userPage #userEmail").val(currentUser.email)
  }

})

addEventListener('userDataUpdated', function()
{

  console.log('userDataUpdated', userData)

  if ( userData == null ) return

  $("#menu header p").html( userData.name )
  $("#userPage #userName").val( userData.name )
  $("#userPage #userSex").val( userData.sex )
  $("#userPage #userEd").val( userData.ed )
  $("#userPage #userFmlCmp").val( userData.fmlCmp )
  $("#userPage #userFmlRnd").val( userData.fmlRnd )

})

addEventListener('userEdit', function()
{
  setPage('user')
})

addEventListener('userSave', function()
{

  // TODO: add processing

  userData.name = $("#userPage #userName").val()
  userData.sex = $("#userPage #userSex").val()
  userData.ed = $("#userPage #userEd").val()
  userData.fmlCmp = $("#userPage #userFmlCmp").val()
  userData.fmlRnd = $("#userPage #userFmlRnd").val()

  var userEmail = $("#userPage #userEmail").val()

  if ( userEmail != currentUser.email )
  {
    console.log('try to set new email')
    currentUser.updateEmail( userEmail )
      .then( function(){ emit('userSet') } )
      .catch( function(err){ alert( errMessages[err.code] ) } )
  }

  emit('userDataSave');

})

var $userForm = $('#userPage form')
addEventListener('userBefore', function(ev)
{
  setPage('user')
})

$userForm.submit(function(ev)
{
  ev.preventDefault()
  ev.stopPropagation()

  if ( $userForm[0].checkValidity() )
  {
    emit('userSave')
  }

})
