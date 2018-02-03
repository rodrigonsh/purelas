function q(query)
{
  return document.querySelector(query)
}

function emit( evName, data )
{

  if ( data == undefined ) console.log('emit', evName)
  else console.log('emit', evName, data)

  var e = new Event(evName)
  e.data = data
  dispatchEvent( e )

}

const debounce = (func, delay) => {
  let inDebounce
  return function() {
    const context = this
    const args = arguments
    clearTimeout(inDebounce)
    inDebounce = setTimeout(() => func.apply(context, args), delay)
  }
}

function getTargetPage(t)
{

  var count = 0

  while( count < 10 && !t.classList.contains('page') )
  {
    t = t.parentNode
    count++
  }

  if ( count == 10 )
  {
    alert('Erro na interface, se este erro persistir contacte o desenvolvedor')
  }

  return t

}

function makeLatLng(coords)
{
  return { lat: coords[0], lng: coords[1] }
}
