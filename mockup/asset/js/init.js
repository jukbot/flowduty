const firebase = require("firebase")

const firebaseConfig = {
    apiKey: "AIzaSyBbZs7FuivpJrRX0-DzMep6RcSGC30h75s",
    authDomain: "flowduty-9142d.firebaseapp.com",
    databaseURL: "https://flowduty-9142d.firebaseio.com",
    projectId: "flowduty-9142d",
    storageBucket: "flowduty-9142d.appspot.com",
    messagingSenderId: "654812271356",
    appId: "1:654812271356:web:6c94925a579ad511dc7d79",
    measurementId: "G-ZR0KK9S1WG"
}

if(!firebase.apps.length)
    firebase.initializeApp(firebaseConfig)

module.exports = firebase