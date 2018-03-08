var config = {
    apiKey: "AIzaSyB-ajkLDUfzB9jgJvEnSS4vWP7rtI-dC8Q",
    authDomain: "purelas-190223.firebaseapp.com",
    databaseURL: "https://purelas-190223.firebaseio.com",
    projectId: "purelas-190223",
    storageBucket: "purelas-190223.appspot.com",
    messagingSenderId: "1005650845624"
  };

firebase.initializeApp(config);

var db = firebase.database()
var auth = firebase.auth()
var connectedRef = db.ref(".info/connected");
var firebaseOnline = false;

var UID = null

connectedRef.on("value", function(snap) {

  if ( snap.val() === true )
  {
    firebaseOnline = true
    emit("online")
  }

  else
  {
    firebaseOnline = false
    emit("offline")
  }

});

addEventListener('queueChanged', function()
{
  if( firebaseOnline ) emit('processQueue')
})
