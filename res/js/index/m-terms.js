addEventListener("termsShow", function()
{

  var $termsModal = q("#termsModal")
  $termsModal.addEventListener("touchmove", function(ev){
    ev.stopPropagation()
  })

})
