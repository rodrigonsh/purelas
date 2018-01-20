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
var currentPage = $($("#"+$navigator.dataset.page+"Page")[0]);
var nextPage = null;

function setPage( pageName )
{

  console.log('setPage', pageName)

  if ( $navigator.dataset.page != pageName )
  {

    currentPage.removeClass('showing')
    currentPage.addClass('hiding')

    $navigator.dataset.page = pageName;

    nextPage = $($(".page[data-page='"+pageName+"']")[0])
    console.log("nextPage.addClass('showing')")
    nextPage.addClass('showing')
    nextPage.addClass('show')
    nextPage.removeClass('showing')

    setTimeout(function()
    {
      currentPage.removeClass('show')
    }, 300)

    setTimeout( function() {

      currentPage.removeClass('hiding')
      currentPage = nextPage

    } , 500 )

    /*setTimeout( function(){



    }, 3000 )*/

    pages.push( $navigator.dataset.page )

  }
}

$("[data-page]").click(function(ev)
{

  ev.stopPropagation()

  var target = ev.currentTarget;

  console.log(target.tagName, target.dataset.page)

  setPage( target.dataset.page )

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
