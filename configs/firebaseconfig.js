import { initializeApp } from 'firebase/app';
import * as firebase from 'firebase/messaging';
import { runFbOrNot } from './firebaseToken';

const config = {
    apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGEBUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGINGSENDERID,
    appId: process.env.REACT_APP_FIREBASE_APPID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENTID
}

// Initilazing the app
let firebaseApp, messaging;
if (runFbOrNot) {
    firebaseApp = initializeApp(config)
    messaging = firebase.getMessaging(firebaseApp)
}

// Gets the token and sets it to a state variable
export const getMyToken = setToken => {
    firebase.getToken(messaging).then(token => {
        setToken(token)
    }).catch(err => {
        console.log(err)
    })
}

// Runs in foreground
export const onMessageListener = () => {
    if (runFbOrNot) {
        return new Promise((resolve) => {
            firebase.onMessage(messaging, (payload) => {
                resolve(payload);
            });
        });
    } else {

    }

}