var shell = document.getElementById('shell');

var touchStartX = null
var touchStartY = null

var touchDiffX = null
var touchDiffY = null

shell.addEventListener('touchstart', function(ev)
{
  touchStartX = ev.touches[0].clientX
  touchStartY = ev.touches[0].clientY
})

shell.addEventListener('touchmove', function(ev)
{

  touchDiffX = ev.touches[0].clientX - touchStartX
  touchDiffY = ev.touches[0].clientY - touchStartY

  if ( Math.abs(touchDiffY) > Math.abs(touchDiffX) )
  {
    //console.log('vertical scroll')
    return;
  }

  ev.preventDefault()

  shell.classList.add('drag')

  //console.log(touchDiffX, touchDiffY)

  var currTranslate = parseInt(
    $app.style.transform
      .replace('translateX(', '')
      .substr( 0, $app.style.transform.length-1 )
    )

  offset = -244
  if ( $app.hasAttribute('menu-open') )
  {

    offset = 0;

    if ( touchDiffX > 0 )
    {
      touchDiffX = 0;
    }

  }
  else
  {

    if ( touchDiffX < 0 )
    {
      touchDiffX = 0 ;
    }

    if ( touchDiffX > 244 )
    {
      touchDiffX = 244
    }

  }

  finalOffset = offset + touchDiffX;

  $app.style.transform = "translateX("+finalOffset+"px)"

})

shell.addEventListener('touchend', function(ev)
{

  var touchStartX = null
  var touchStartY = null

  if( 'action' in ev.target.dataset && ev.target.dataset.action == 'menu')
  {
    return
  }

  if ( touchDiffX > 60 )
  {
    $app.setAttribute('menu-open', true)
  }
  else
  {
    $app.removeAttribute('menu-open')
  }

  $app.style.transform = null

  shell.classList.remove('drag')

})

function toast(msg)
{
  q("toast span").textContent = msg

  q("toast").removeAttribute('hidden')

  setTimeout( function()
  {
    q("toast").setAttribute('hidden', 'hidden')
  }, 3000)
}
