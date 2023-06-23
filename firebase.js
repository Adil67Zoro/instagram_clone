import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/storage';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyA2u_U4O9nyoUycEGeeFQ-0PihzTa_tDMg",
    authDomain: "instagram-clone-ea1ad.firebaseapp.com",
    projectId: "instagram-clone-ea1ad",
    storageBucket: "instagram-clone-ea1ad.appspot.com",
    messagingSenderId: "834050270437",
    appId: "1:834050270437:web:10d478c8c59171464ba00c",
    measurementId: "G-45EG8ZHGWG"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };


