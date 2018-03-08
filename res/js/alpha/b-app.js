var $app = q('#app')

addEventListener('online', function()
{
  $app.classList.remove('offline')
})

addEventListener('offline', function()
{
  $app.classList.add('offline')
})

addEventListener('userSet', function()
{
  if ( currentUser != null )
  {
    $app.classList.add('logged')
  } else {
    $app.classList.remove('logged')
  }

})

addEventListener('adminSet', function()
{
  if ( admin )
  {
    $app.classList.add('is_admin')
  } else {
    $app.classList.remove('is_admin')
  }

})


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

$("[data-action=closeModal]").on('tap', function(ev){

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


$("[data-action=save]").on('tap', function(ev)
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

$("[data-action=view]").on('tap', function(ev)
{

  ev.stopPropagation()
  ev.preventDefault()

  var t = getTargetPage(ev.currentTarget)
  emit(t.dataset.page+"View", ev.target)

})
