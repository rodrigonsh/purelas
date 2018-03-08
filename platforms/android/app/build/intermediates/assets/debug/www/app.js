dataQueue = JSON.parse( localStorage.getItem('dataQueue') )
if ( dataQueue == null ) dataQueue = []

function saveQueue()
{
  localStorage.setItem( 'dataQueue', JSON.stringify(dataQueue) )
}

function enqueue( name )
{
  if ( dataQueue.indexOf(name) == -1 )
  {
    dataQueue.push( name )
    saveQueue()
    emit('queueChanged')
  }
}

addEventListener('online', function()
{
  if ( UID != null ) emit("processQueue")
})

addEventListener('userSet', function()
{
  if ( UID != null && firebaseOnline ) emit("processQueue")
})

addEventListener("processQueue", function(){

  if ( dataQueue.length )
  {
    next = dataQueue.pop()
    emit(next+'Send')
    saveQueue()
  }

})

var config = {
    apiKey: "AIzaSyB-ajkLDUfzB9jgJvEnSS4vWP7rtI-dC8Q",
    authDomain: "purelas-190223.firebaseapp.com",
    databaseURL: "https://purelas-190223.firebaseio.com",
    projectId: "purelas-190223",
    storageBucket: "purelas-190223.appspot.com",
    messagingSenderId: "1005650845624"
  };

firebase.initializeApp(config);

var db = firebase.database()
var auth = firebase.auth()
var connectedRef = db.ref(".info/connected");
var firebaseOnline = false;

var UID = null

connectedRef.on("value", function(snap) {

  if ( snap.val() === true )
  {
    firebaseOnline = true
    emit("online")
  }

  else
  {
    firebaseOnline = false
    emit("offline")
  }

});

addEventListener('queueChanged', function()
{
  if( firebaseOnline ) emit('processQueue')
})

moment.locale("pt");


var $navigator = document.getElementById('navigator');
var $menu = document.getElementById('menu');

var pages = []
var currentPage = q("#"+$navigator.dataset.page+"Page");
var nextPage = null;

function setPage( pageName )
{

  console.log('setPage', pageName)

  if ( $navigator.dataset.page != pageName )
  {

    nextPage = q(".page[data-page='"+pageName+"']")

    if ( nextPage.hasAttribute('admin') && !admin )
    {
      console.error('this page requires admin')
      afterAuth = pageName
      setPage('login')
      return
    }

    console.log('so far so good for', pageName)

    currentPage.classList.add('hiding')

    $navigator.dataset.page = pageName;


    nextPage.classList.add('showing')
    nextPage.classList.add('show')
    nextPage.classList.remove('showing')

    setTimeout(function()
    {
      currentPage.classList.remove('show')
    }, 300)

    setTimeout( function() {

      currentPage.classList.remove('hiding')
      currentPage = nextPage
      emit(currentPage.dataset.page+"After")

    } , 500 )

    pages.push( $navigator.dataset.page )

  }
}

$("[data-page]").on('tap', function(ev)
{

  ev.stopPropagation()

  var currentTarget = ev.currentTarget
  var pageName = currentTarget.dataset.page

  if ( currentTarget.classList.contains('page') )
  {
    return;
  }

  var next = q(".page[data-page='"+pageName+"']")

  if ( next.hasAttribute('admin') && !admin )
  {
    afterAuth = pageName
    setPage('login')
  }

  if ( next.hasAttribute('auth') && UID == null )
  {
    afterAuth = pageName
    setPage('login')
  } else {
    emit( pageName+"Before" )
  }

  $app.removeAttribute('menu-open')


});



$("[data-action='back']").on('tap', function(ev){

  ev.stopPropagation()
  emit('backbutton')

});

addEventListener('keyup', function(ev){
  if( ev.keyCode == 27 )
  {
    emit('backbutton')
  }
})


function onBackButton(ev){

  console.log('opa!', pages)

  ev.stopPropagation()
  ev.preventDefault()

  if ( $app.hasAttribute('menu-open') )
  {
    $app.removeAttribute('menu-open')
    return
  }

  if ( pages.length > 1 )
  {
    var current = pages.pop()
    var before = pages.pop()

    if ( before == 'thanks' )
    {
      before = pages.pop()
    }

    console.log('current:', current, 'before:', before)

    setPage(before)
  }
  else
  {
    navigator.app.exitApp()
  }


}

window.addEventListener('backbutton', onBackButton, false);
document.addEventListener('backbutton', onBackButton, false);

addEventListener('gotMeasures', function(ev)
{
  $menu.style.height = shellHeight+"px"
})

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


var mapAPIKey = "AIzaSyAgQ3Td8h6homy1Hf2MIT9DUR9882g-42Q"

var map = null
var routeMap = null
var reportEditMap = null
var reportViewMap = null
var mapsReady = false
var renderMap = null

var directionsDisplay;
var directionsService;


function getCircle()
{
  return {
    path: google.maps.SymbolPath.Circle,
    fillColor: 'red',
    fillOpacity: .2,
    scale: 2,
    strokeColor: 'white',
    strokeWeight: .5
  };
}

function initMap()
{

  console.log('initMap', currentLatLng)

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    disableDefaultUI: true,
  });

  directionsService = new google.maps.DirectionsService()
  directionsDisplay = new google.maps.DirectionsRenderer()

  directionsDisplay.setMap( map );

  map.data.setStyle(function(feature)
  {

    return
    {
      icon: getCircle()
    };

  });

  if ( currentLatLng != null )
  {
    try
    {
      console.log( typeof currentLatLng, currentLatLng.lat, currentLatLng.lng )
      map.setCenter( currentLatLng )
    } catch( e ){ console.error( e, currentLatLng ) }

  }

  mapsReady = true

  if ( renderMap != null)
  {
    emit(renderMap+"Render")
    renderMap = null
  }

  /*var marker = new google.maps.Marker({
    position: cg,
    map: map
  });*/

}

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

addEventListener('notificationsBefore', function(){

  setPage('notifications')

})

addEventListener('onboardingBefore', function(){

  setPage('onboarding')

  localStorage.setItem('onboard', true)

})

addEventListener('preferencesBefore', function(){

  setPage('preferences')

})

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
    $registerForm.classList.remove('failed')
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

    var http = new XMLHttpRequest()
    http.onreadystatechange = function()
    {
    	if( http.readyState != 4 ) return

      var txt = http.responseText
      while( txt.indexOf("\n") > -1 )
      {
        txt = txt.replace("\n", "<br/>")
      }

      q("#termsModal p").innerHTML = txt
    }

    http.open('get', 'politica-de-privacidade.txt')
    http.send()


  }

  setPage('register')
  
})

$thanksMessage = q("#thanksPage p strong")
$thanksAux = q("#thanksPage p.aux")

addEventListener('thanksBefore', function(){

  setPage('thanks')

})

addEventListener('thanksAfter', function()
{
  setTimeout( () => emit('mapBefore'), 5000 )
})

addEventListener('thanks', function(ev)
{

  if ( ev.data == 'user' )
  {
    $thanksMessage.textContent = "Obrigado por atualizar suas informações"
    $thanksAux.textContent = "Seus dados são sigilosos e não serão compartilhados"
  }

  if ( ev.data == 'report' )
  {
    $thanksMessage.textContent = "Obrigado por compartilhar seu relato"
    $thanksAux.textContent = "Esta informação é anônima e você pode editá-la quando quiser"
  }

  if ( ev.data == 'opinion' )
  {
    $thanksMessage.textContent = "Agradecemos sua opinião"
    $thanksAux.textContent = "Ela será levada à sério e responderemos se for necessário"
  }

  emit('thanksBefore')


})

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

addEventListener('welcomeBefore', function(){

  setPage('welcome')

  localStorage.setItem('welcome', true)

})
