import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-analytics.js";
import { getMessaging, onBackgroundMessage } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-messaging.js";

const firebaseConfig = {
    apiKey: "AIzaSyAJHS1ppIoFvAtYnxI1Li0JhTPJ-mMU2zo",
    authDomain: "ev-notification.firebaseapp.com",
    projectId: "ev-notification",
    storageBucket: "ev-notification.appspot.com",
    messagingSenderId: "857330862150",
    appId: "1:857330862150:web:14d7535e086d99a1482247",
    measurementId: "G-RQ9DY8CV5D"
};

// Import and configure the Firebase SDK
// These scripts are made available when the app is served or deployed on Firebase Hosting
// If you do not serve/host your project using Firebase Hosting see https://firebase.google.com/docs/web/setup
importScripts('/__/firebase/9.2.0/firebase-app-compat.js');
importScripts('/__/firebase/9.2.0/firebase-messaging-compat.js');
importScripts('/__/firebase/init.js');

const firebase = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const messaging = getMessaging(firebase);

// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should
// implement this optional method.
// Keep in mind that FCM will still show notification messages automatically
// and you should use data messages for custom notifications.
// For more info see:
// https://firebase.google.com/docs/cloud-messaging/concept-options
onBackgroundMessage(function(payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
        body: 'Background Message body.',
        icon: '/firebase-logo.png'
    };

    self.registration.showNotification(notificationTitle,
        notificationOptions);
});