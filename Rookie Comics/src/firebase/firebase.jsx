// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCqzgseo80p1DiPTr1UbSNwgcnb1xjpgZ4",
  authDomain: "rookiescomics.firebaseapp.com",
  projectId: "rookiescomics",
  storageBucket: "rookiescomics.firebasestorage.app",
  messagingSenderId: "999792480834",
  appId: "1:999792480834:web:dd2bd827e577458935d3db",
  measurementId: "G-VNJ89XXKVK"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);
const storage = getStorage(firebaseApp);

export { storage, ref, uploadBytesResumable, getDownloadURL };