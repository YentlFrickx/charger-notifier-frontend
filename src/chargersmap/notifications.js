// https://github.com/firebase/quickstart-js/blob/master/messaging/index.html
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage, deleteToken } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyAJHS1ppIoFvAtYnxI1Li0JhTPJ-mMU2zo",
    authDomain: "ev-notification.firebaseapp.com",
    projectId: "ev-notification",
    storageBucket: "ev-notification.appspot.com",
    messagingSenderId: "857330862150",
    appId: "1:857330862150:web:14d7535e086d99a1482247",
    measurementId: "G-RQ9DY8CV5D"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const messaging = getMessaging(firebase);

// onMessage((payload) => {
//     console.log('Message received. ', payload);
//     // Update the UI to include the received message.
//     appendMessage(payload);
// });

export function requestPermission() {
    console.log('Requesting permission...');
    Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
            console.log('Notification permission granted.');
        } else {
            console.log('Unable to get permission to notify.');
        }
    });
}

export function isSubscribed(topic) {
    return window.localStorage.getItem(topic) === 'true';
}

function setSubscribed(topic, subscribed) {
    window.localStorage.setItem(topic, subscribed);
}

export function subscribeTopic(topic) {
    if (isSubscribed(topic)) {
        return;
    }
    getToken(messaging, {vapidKey: 'BH7vtSjsDf8h9IQyROmPZb3x5HOzVt9oEEmOUqSMUbh19EPbpVYKkNDj_Jkrblsjw3ch7eetGk5lk86GGLk_YRM'}).then((currentToken) => {
        fetch('https://charger-api.yfrickx.be/api/notify/sub', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "topic": topic,
                "fcmRegistrationTokens": [currentToken]
            })
        }).then(() => {
            setSubscribed(topic, true)
        })
    });
}

export function unsubscribeTopic(topic) {
    getToken(messaging, {vapidKey: 'BH7vtSjsDf8h9IQyROmPZb3x5HOzVt9oEEmOUqSMUbh19EPbpVYKkNDj_Jkrblsjw3ch7eetGk5lk86GGLk_YRM'}).then((currentToken) => {
        deleteToken(messaging, {vapidKey: 'BH7vtSjsDf8h9IQyROmPZb3x5HOzVt9oEEmOUqSMUbh19EPbpVYKkNDj_Jkrblsjw3ch7eetGk5lk86GGLk_YRM'}).then(() => {
            fetch('https://charger-api.yfrickx.be/api/notify/unsub', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "topic": topic,
                    "fcmRegistrationTokens": [currentToken]
                })
            }).then(() => {
                setSubscribed(topic, false)
            })
        }).catch((err) => {
            console.log('Unable to delete token. ', err);
        });
    });
}
