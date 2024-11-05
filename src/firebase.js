import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyBrZZUDXF4uVd6KWVoXEEGyiTxWTyyfCG8",
  authDomain: "vote-app-e7911.firebaseapp.com",
  projectId: "vote-app-e7911",
  storageBucket: "vote-app-e7911.firebasestorage.app",
  messagingSenderId: "236390690417",
  appId: "1:236390690417:web:41b632229901ac7e1675d0"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const auth = firebase.auth();
const functions = firebase.functions();

export { firebase, db, auth, functions };