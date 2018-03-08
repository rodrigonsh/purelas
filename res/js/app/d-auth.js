var newUser = null;
var userData = JSON.parse( localStorage.getItem('userData') );
var currentUser = null;
var afterAuth = null;

var adminRef = null
var admin = false

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

    if ( firebaseOnline ) emit("processQueue")

    adminRef = db.ref('admins/'+UID)
    adminRef.on('value', function(s){ admin = s.val(); emit('adminSet', admin) })

    db.ref("users/"+UID).on('value', function(s){

      userData = s.val()
      emit('userDataUpdated')

    })

    emit('updateLoginInfo')

    if( newUser ) emit('userNew')
    if ( afterAuth != null )
    {
      setTimeout(function()
      {
        emit( afterAuth+'Before' )
        afterAuth = null
      }, 2000)
    }

    newUser = false;

  }

  emit('userSet', UID);

})



function shouldUpdateUserData()
{
  return db.ref("users/"+UID).set( userData )
}

addEventListener('userDataSave', function()
{

  localStorage.setItem( 'userData', JSON.stringify(userData) )
  enqueue('userData')

})

addEventListener('updateLoginInfo', function()
{

  db.ref("users/"+UID)
    .child('logged_at')
    .set( new Date().valueOf() )
    .catch( function(err){ emit('error', {kind:'user', err:err}) } )

})

addEventListener('userDataSend', function()
{

  if ( UID == null) return;

  currentUser.updateProfile( { displayName: userData.name } )
  .then( shouldUpdateUserData )
  .catch( function(err){ emit('error', { kind:'user', err: err }) } )

})

$("[data-action=logout]").on('tap', function(ev){

  logout()

});
