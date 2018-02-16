
var userReport = JSON.parse( localStorage.getItem('userReport') )
var userReportRef = null;

function resetuserReport()
{
  userReport = {
    type: '',
    address: '',
    report: '',
    agressor: '',
    timestamp: new Date().valueOf(),
    coords: [0,0]
  }
}

if ( userReport == null ) resetuserReport()


addEventListener('userSet', function()
{
  if ( UID == null ) return

  userReportRef = db.ref( '/reports/'+UID )
  userReportRef.on('value', function(s)
  {

    if ( s.val() == null ) resetuserReport()
    else userReport = s.val()

    localStorage.setItem( 'userReport' , JSON.stringify( userReport ) )

  })

})
