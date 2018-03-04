
var $navigator = document.getElementById('navigator');


$("[data-action=menu]").on('tap', function(ev){

  ev.stopPropagation()

  if ($app.hasAttribute('menu-open'))
  {
    console.log('lets close')
    $app.removeAttribute('menu-open')
  } else {
    console.log('lets open')
    $app.setAttribute('menu-open', true)
  }

});

$("[data-modal]").on('tap', function(ev){

  ev.stopPropagation()

  var target = ev.currentTarget
  if ( target.classList.contains('modal') )
  {
    return;
  }

  console.log(".modal[data-modal="+target.dataset.modal+"]")

  $(".modal[data-modal="+target.dataset.modal+"]").addClass('show')
  $app.classList.toggle('modal-over')

  emit(target.dataset.modal+"Show")

});

$("[data-action='closeModal']").on('tap', function(ev){

  ev.stopPropagation()

  var t = ev.currentTarget
  var count = 0
  while( count < 10 && !t.dataset.hasOwnProperty('modal') )
  {
    t = t.parentNode;
    count++
  }

  if ( count == 10 )
  {
    alert('Erro na interface, se este erro persistir contacte o desenvolvedor')
  }

  t.classList.remove('show')

  $app.classList.toggle('modal-over')

});


$("[data-action='save']").on('tap', function(ev)
{
  ev.stopPropagation()
  ev.preventDefault()

  if( 'Keyboard' in window )
  {
    console.log('gotta hide that keyboard')
    Keyboard.hide()
  }

  var t = getTargetPage(ev.currentTarget)
  emit(t.dataset.page+"Save")

})

var pages = []
var currentPage = q("#"+$navigator.dataset.page+"Page");
var nextPage = null;

function setPage( pageName )
{

  console.log('setPage', pageName)

  if ( $navigator.dataset.page != pageName )
  {

    currentPage.classList.add('hiding')

    $navigator.dataset.page = pageName;

    nextPage = q(".page[data-page='"+pageName+"']")

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

  if ( next.hasAttribute('auth') && UID == null )
  {
    afterAuth = pageName
    setPage('login')
  } else {
    emit( pageName+"Before" )
  }

  $app.removeAttribute('menu-open')


});

$("[data-action='logout']").on('tap', function(ev){

  logout()

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

$("[data-action=map-center]").on('tap', function(ev)
{

  ev.preventDefault()
  ev.stopPropagation()

  emit('map-center')

})

$("[data-action='view']").on('tap', function(ev)
{

  ev.stopPropagation()
  ev.preventDefault()

  var t = getTargetPage(ev.currentTarget)
  emit(t.dataset.page+"View", ev.target)

})

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

  watchPosition = navigator.geolocation.watchPosition(
    gotPosition,
    noPosition,
    { timeout: 30000 })

})

setTimeout(function()
{
  var e = new Event('deviceready')
  document.dispatchEvent(e)
}, 10000)
