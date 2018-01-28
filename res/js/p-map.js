$map = q("#map")
$map.addEventListener('touchmove', function(ev){
  ev.stopPropagation()
})

addEventListener('mapBefore', function(){

  setPage('map')

})
