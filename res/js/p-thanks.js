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
