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
