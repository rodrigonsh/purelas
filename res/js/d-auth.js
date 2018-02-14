var newUser = null;
var userData = null;
var currentUser = null;

function logout()
{
  UID = null
  auth.signOut()
  alert("Usuário foi desconectado")
}

function login( email, password )
{

  auth.signInWithEmailAndPassword(email, password)
    .catch( function(error)
    {
      emit("authError", error)
    })
}

function register( email, password )
{
  var newUser = true;

  auth.createUserWithEmailAndPassword( email, password )
    .catch( function(error)
    {
      emit('registerError', error)
    })
}

auth.onAuthStateChanged( function (user)
{

  currentUser = user

  if ( user == null )
  {
    UID = null;
  }

  else
  {

    UID = user.uid

    db.ref("users/"+UID).on('value', function(s){

      userData = s.val()
      emit('userDataUpdated')

    })

    if( newUser ) emit('userNew')
    else emit('mapBefore')

    newUser = false;

  }

  emit('userSet', UID);

})


addEventListener('userDataSave', function()
{

  currentUser.updateProfile( { displayName: userData.name } )
  db.ref("users/"+UID)
    .set( userData )
    .then( function(ev){ emit('homeBefore') } )

})
