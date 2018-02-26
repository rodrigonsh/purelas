dataQueue = JSON.parse( localStorage.getItem('dataQueue') )
if ( dataQueue == null ) dataQueue = []

function saveQueue()
{
  localStorage.setItem( 'dataQueue', JSON.stringify(dataQueue) )
}

function enqueue( name )
{
  if ( dataQueue.indexOf(name) == -1 )
  {
    dataQueue.push( name )
    saveQueue()
    emit('queueChanged')
  }
}

addEventListener('online', function()
{
  if ( UID != null ) emit("processQueue")
})

addEventListener('userSet', function()
{
  if ( UID != null && firebaseOnline ) emit("processQueue")
})

addEventListener("processQueue", function(){

  if ( dataQueue.length )
  {
    next = dataQueue.pop()
    emit(next+'Send')
    saveQueue()
  }

})
