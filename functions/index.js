const functions = require('firebase-functions');
const cors = require('cors')({origin: true});
const admin = require('firebase-admin');
const GeoFire = require('geofire');

admin.initializeApp(functions.config().firebase);

const geoRef = admin.database().ref('/geofire')
const geoFire = new GeoFire(geoRef);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.sendReport = functions.https.onRequest((req, res) => {

  cors(req, res, function(){

    if (!req.isPost) return

    var ts = new Date().valueOf()

    var latlng = req.body.coords
    var coords = [ latlng.lat, latlng.lng ]

    delete req.body.coords

    admin.database().ref('/reports').child(ts).set(req.body)
    geoFire.set(ts.toString(), coords)

    res.status(200).send(ts);

  })


    // Grab the text parameter.
    //const original = req.body.text;
    // Push the new message into the Realtime Database using the Firebase Admin SDK.
    //admin.database().ref('/messages').push({original: original}).then(snapshot => {
      // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
      //res.redirect(303, snapshot.ref);
    //});


});
