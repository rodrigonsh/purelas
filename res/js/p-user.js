var $userDataName = $("#userPage #userName")
var $userDataEmail = $("#userPage #userEmail")
var $userDataSex = $("#userPage #userSex")
var $userDataEd = $("#userPage #userEd")
var $userDataFmlCmp = $("#userPage #userFmlCmp")
var $userDataFmlRnd = $("#userPage #userFmlRnd")

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

    $userDataName.val("")
    $userDataEmail.val("")
  }

  else
  {
    $("#menu header p").html(currentUser.displayName)
    $("#menu header small").html(currentUser.email)

    $userDataName.val(currentUser.displayName)
    $userDataEmail.val(currentUser.email)
  }

})

addEventListener('userDataUpdated', function()
{

  console.log('userDataUpdated', userData)

  if ( userData == null ) return

  $userDataSex.val( userData.sex )
  $userDataEd.val( userData.ed )
  $userDataFmlCmp.val( userData.fmlCmp )
  $userDataFmlRnd.val( userData.fmlRnd )

})

addEventListener('userEdit', function()
{
  setPage('user')
})

addEventListener('userSave', function()
{

  // TODO: add processing

  $userDataName.blur()
  $userDataSex.blur()
  $userDataEd.blur()
  $userDataFmlCmp.blur()
  $userDataFmlRnd.blur()

  userData.name = $userDataName.val()
  userData.sex = $userDataSex.val()
  userData.ed = $userDataEd.val()
  userData.fmlCmp = $userDataFmlCmp.val()
  userData.fmlRnd = $userDataFmlRnd.val()

  var userEmail = $userDataEmail.val()

  if ( userEmail != currentUser.email )
  {
    console.log('try to set new email')
    currentUser.updateEmail( userEmail )
      .then( function(){ emit('userSet') } )
      .catch( function(err){ alert( errMessages[err.code] ) } )
  }

  emit('userDataSave');

})

addEventListener('userBefore', function(ev)
{
  setPage('user')
})



var $userForm = $('#userPage form')

$userForm.submit(function(ev)
{
  ev.preventDefault()
  ev.stopPropagation()

  if ( $userForm[0].checkValidity() )
  {
    emit('userSave')
  }

})
