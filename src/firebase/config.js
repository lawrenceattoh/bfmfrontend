import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDrIUeTvVZw2FqkmH64YzMv6TyvYc_n6d8",
    authDomain: "rms-dev-e3394.firebaseapp.com",
    projectId: "rms-dev-e3394",
    storageBucket: "rms-dev-e3394.firebasestorage.app",
    messagingSenderId: "110041080836",
    appId: "1:110041080836:web:971d47538804d67b7a4151"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {auth};