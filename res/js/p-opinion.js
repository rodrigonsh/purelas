$opinionForm = q('#opinionPage form')

$opinionForm.addEventListener('submit', function(ev)
{
  ev.stopPropagation()
  ev.preventDefault()

  var opinion =
  {
    text: $opinionForm.querySelector('textarea').value.trim(),
    uid: UID
  }

  if ( opinion.text == "")
  {
    alert('Opinião deve ser preenchida')
    return;
  }

  console.log( 'borasalvar?', opinion )

  db.ref('opinions').child( new Date().valueOf() ).set( opinion )
    .then( function(){ return Promise.resolve( () => emit('thanks', 'opinion') ) } )
    .catch( function(msg){ emit("error", {kind:"opinion", err:msg} ) } )

})

addEventListener('opinionBefore', function(){

  setPage('opinion')

})
