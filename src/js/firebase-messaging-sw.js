importScripts('https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/9.18.0/firebase-analytics.js')

const firebaseConfig = {
    apiKey: "AIzaSyAJHS1ppIoFvAtYnxI1Li0JhTPJ-mMU2zo",
    authDomain: "ev-notification.firebaseapp.com",
    projectId: "ev-notification",
    storageBucket: "ev-notification.appspot.com",
    messagingSenderId: "857330862150",
    appId: "1:857330862150:web:14d7535e086d99a1482247",
    measurementId: "G-RQ9DY8CV5D"
};
firebase.initializeApp(firebaseConfig)
const messaging = firebase.messaging()