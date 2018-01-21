$("preference").click( function(ev)
{

  ev.preventDefault()

  var control = ev.currentTarget.children[1]

  if ( control.hasAttribute('on') )
  {
    control.removeAttribute('on')
  }
  else
  {
    control.setAttribute('on', 'on')
  }

})
