setTimeout(function(){
  $("#splash").addClass('hiding');
}, 1000)

setTimeout(function(){
  $("#splash").addClass('hidden');
}, 1500)

var $navigator = document.getElementById('navigator');
var $app = $('#app');

$("[data-action='menu']").click(function(ev){

  ev.stopPropagation()

  $app.toggleClass('menu-open')

});

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

    } , 500 )

    pages.push( $navigator.dataset.page )

  }
}

$("[data-page]").click(function(ev)
{

  ev.stopPropagation()

  var currentTarget = ev.currentTarget;

  //console.log('click', currentTarget.tagName, currentTarget.dataset.page)

  setPage( currentTarget.dataset.page )

  $app.removeClass('menu-open')


});

$("[data-action='back']").click(function(ev){

  ev.stopPropagation()

  setPage('map');

});

document.addEventListener('backbutton', function(){

  $app.removeClass('menu-open')

  if ( pages.length > 0 )
  {
    var p = pages.pop()
    setPage(page);
  }
  else
  {
    navigator.app.exitApp()
  }


});


setPage('map')
