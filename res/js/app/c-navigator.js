
var $navigator = document.getElementById('navigator');

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
