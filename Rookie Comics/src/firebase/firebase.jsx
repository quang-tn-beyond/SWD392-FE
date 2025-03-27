// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCqzgseo80p1DiPTr1UbSNwgcnb1xjpgZ4",
  authDomain: "rookiescomics.firebaseapp.com",
  databaseURL: "https://rookiescomics-default-rtdb.firebaseio.com",
  projectId: "rookiescomics",
  storageBucket: "rookiescomics.firebasestorage.app",
  messagingSenderId: "999792480834",
  appId: "1:999792480834:web:dd2bd827e577458935d3db"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

export { storage, ref, uploadBytesResumable, getDownloadURL };