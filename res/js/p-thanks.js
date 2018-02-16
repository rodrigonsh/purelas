$thanksMessage = q("#thanksPage p strong")
$thanksAux = q("#thanksPage p.aux")

addEventListener('thanksBefore', function(){

  setPage('thanks')

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
    $thanksAux.textContent = "Esta informação é anônima"
  }

  emit('thanksBefore')

})
