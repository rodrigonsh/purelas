$messagesForm = q('#messagesPage form')
$messagesContainer = q('#messagesPage #messagesContainer')

var messages = {}
var messagesTimestamps = {}
var currentChat = null

emit("messagesReady")

var $contactsList = q('#contactsList')
var $contactMessages = q('#contactMessages')

$contactsList.addEventListener('click', function(ev)
{
  currentChat = ev.target.dataset.uid
  emit('messagesReady')
})

addEventListener('messagesReady', function(ev)
{

  $contactsList.innerHTML = ""
  $contactMessages.innerHTML = ""

  tsKeys = Object.keys( messagesTimestamps )
  tsValues = Object.values( messagesTimestamps )

  console.log('tsKeys', tsKeys)
  console.log('tsValues', tsValues)

  for( var i = 0; i < tsKeys.length; i++ )
  {
    var uid =  tsKeys[i]
    var timestamp = messagesTimestamps[uid]

    var li = document.createElement('li')
    var liCard = document.createElement('card')
    liCard.textContent = uid

    liCard.dataset.uid = uid

    $contactsList.appendChild( liCard )

    if ( currentChat == uid )
    {

      liCard.setAttribute('active', true)

      var keys = Object.keys( messages[uid] )
      console.log(keys)

      for( var j = 0; j < keys.length; j++ )
      {

        console.log(j)

        var card = document.createElement('card')
        if ( UID == messages[uid][ keys[j] ].user )
        {
          card.setAttribute( 'mine', true )
        }

        var p = document.createElement('p')
        p.textContent = messages[uid][ keys[j] ].text

        var date = document.createElement('date')
        date.setAttribute('value', keys[i])
        date.textContent = moment( parseInt(keys[j]) ).format( "LL" )

        card.appendChild( p )
        card.appendChild( date )

        $contactMessages.appendChild(card)

      }

      $contactMessages.scrollTop = 9999999;


    }



  }

})

$messagesForm.addEventListener('submit', function(ev)
{
  ev.stopPropagation()
  ev.preventDefault()

  var message =
  {
    text: $messagesForm.querySelector('input').value.trim(),
    user: UID,
    read: false
  }

  if ( message.text == "")
  {
    return;
  }

  $messagesForm.querySelector('input').value = ""

  db.ref('messages/'+currentChat).child( new Date().valueOf() ).set( message )
    .then( function(){ console.log('messageSet') } )
    .catch( function(msg){ console.log('error', msg) }  )

})

addEventListener('messagesBefore', function()
{
  setPage('messages')
})

addEventListener('messagesAfter', function()
{
  console.log($messagesContainer.offsetHeight)
  $contactMessages.style.height = $messagesContainer.offsetHeight - 83+"px"
  $contactsList.style.height = $messagesContainer.offsetHeight+"px"
})
