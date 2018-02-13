setTimeout(function(){
  $("#splash").addClass('hiding');
}, 1000)

setTimeout(function(){
  $("#splash").addClass('hidden');
}, 1500)

var $navigator = document.getElementById('navigator');
var $app = $('#app');

$("[data-action='menu']").on('tap', function(ev){

  ev.stopPropagation()

  $app.toggleClass('menu-open')

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
  $app.toggleClass('modal-over')

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

  $app.toggleClass('modal-over')

});


$("[data-action='save']").on('tap', function(ev)
{
  ev.stopPropagation()
  ev.preventDefault()

  var t = getTargetPage(v.currentTarget)
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
    setPage('login')
  } else {
    emit( pageName+"Before" )
  }

  $app.removeClass('menu-open')


});

$("[data-action='logout']").on('tap', function(ev){

  logout()

});

$("[data-action='back']").on('tap', function(ev){

  ev.stopPropagation()
  setPage('map');

});

addEventListener('keyup', function(ev){
  if( ev.keyCode == 27 )
  {
    emit('backbutton')
  }
})

addEventListener('backbutton', function(){

  $app.removeClass('menu-open')

  if ( pages.length > 1 )
  {
    var current = pages.pop()
    var before = pages.pop()

    console.log('current:', current, 'before:', before)

    setPage(before)
  }
  else
  {
    navigator.app.exitApp()
  }


});

$("[data-action=map-center]").on('tap', function(ev)
{

  ev.preventDefault()
  ev.stopPropagation()

  console.log('map-center tap')

  getCoords()

})

$("[data-action='view']").on('tap', function(ev)
{

  ev.stopPropagation()
  ev.preventDefault()

  var t = getTargetPage(ev.currentTarget)
  emit(t.dataset.page+"View", ev.target)

})

if ( localStorage.getItem('onboard') == null )
{
  setPage('welcome')
}
else
{
  setPage('map')
}
