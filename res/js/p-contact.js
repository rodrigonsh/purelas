$contactForm = q('#contactPage form')

var messages = JSON.parse( localStorage.getItem('messages') )
if ( messages == null ) messages = {}

emit("messagesReady")

var messagesRef = null;

addEventListener('userSet', function()
{
  if ( UID == null ) return
  messagesRef = db.ref('messages/'+UID)
  messagesRef.on('value', function(snap)
{

  if( snap.val() ==  null ) messages = {}
  else messages = snap.val()

  localStorage.setItem('messages', JSON.stringify( messages ))
  emit('messagesReady')

})
})

var $contactMessages = q('#contactMessages')


addEventListener('messagesReady', function(ev)
{

  $contactMessages.innerHTML = ""
  var keys = Object.keys( messages )
  for( var i = 0; i < keys.length; i++ )
  {

    var card = document.createElement('card')
    if ( UID == messages[ keys[i] ].user )
    {
      card.setAttribute( 'mine', true )
    }

    var p = document.createElement('p')
    p.textContent = messages[ keys[i] ].text

    var date = document.createElement('date')
    date.setAttribute('value', keys[i])
    date.textContent = moment( parseInt(keys[i]) ).format( "LL" )

    card.appendChild( p )
    card.appendChild( date )

    $contactMessages.appendChild(card)

  }

})

$contactForm.addEventListener('submit', function(ev)
{
  ev.stopPropagation()
  ev.preventDefault()

  var message =
  {
    text: $contactForm.querySelector('input').value.trim(),
    user: UID
  }

  if ( message.text == "")
  {
    return;
  }

  $contactForm.querySelector('input').value = ""

  db.ref('messages/'+UID).child( new Date().valueOf() ).set( message )
    .then( function(){ console.log('messageSet') } )
    .catch( function(msg){ console.log('error', msg) }  )

})

addEventListener('contactBefore', function(){

  setPage('contact')

})
