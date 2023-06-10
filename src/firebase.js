// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD-Csm7Yq2ILj0xFBKhh9W_HqeO4CdoAnU",
  authDomain: "social-media-14bd6.firebaseapp.com",
  projectId: "social-media-14bd6",
  storageBucket: "social-media-14bd6.appspot.com",
  messagingSenderId: "899970193387",
  appId: "1:899970193387:web:c1ff63398d9ec6c557ebae",
  measurementId: "G-XMM1NPK5JY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app)

export default auth;