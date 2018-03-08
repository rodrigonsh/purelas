
if ( localStorage.getItem('welcome') == null )
{
  emit('welcomeBefore')
}
else
{
  setPage('map')
}

setTimeout(function(){
  $("#splash").addClass('hiding');
}, 1500)

setTimeout(function(){
  $("#splash").addClass('hidden');
}, 2500)


function onLoad()
{

  console.log('onLoad')

}

var ignited = false

document.addEventListener('deviceready', function()
{

  if ( ignited ) return

  ignited = true
  console.log('deviceready')
  navigator.splashscreen.hide()

})

setTimeout(function()
{
  var e = new Event('deviceready')
  document.dispatchEvent(e)
}, 10000)
