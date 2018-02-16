var newUser = null;
var userData = JSON.parse( localStorage.getItem('userData') );
var currentUser = null;
var afterAuth = null;

if ( userData == null )
{
  userData =
  {
    name: "Seu nome",
    registered_at: null,
    logged_at: new Date().valueOf(),
    
  }
}

function logout()
{
  UID = null
  auth.signOut()
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
    UID = null
    afterAuth = null
  }

  else
  {

    UID = user.uid

    db.ref("users/"+UID).on('value', function(s){

      userData = s.val()
      emit('userDataUpdated')

    })

    emit('updateLoginInfo')

    if( newUser ) emit('userNew')
    if ( afterAuth != null ) emit( afterAuth+'Before' )

    newUser = false;

  }

  emit('userSet', UID);

})


addEventListener('userDataSave', function()
{

  localStorage.setItem( 'userData', JSON.stringify(userData) )

  currentUser.updateProfile( { displayName: userData.name } )
  db.ref("users/"+UID)
    .set( userData )
    .then( function(ev){ emit('thanks', 'user') } )
    .catch( function(err){ emit('err', {kind:'user', err:err}) } )

})

addEventListener('updateLoginInfo', function()
{

  db.ref("users/"+UID)
    .child('logged_at')
    .set( new Date().valueOf() )
    .catch( function(err){ emit('err', {kind:'user', err:err}) } )

})
