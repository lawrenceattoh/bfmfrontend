import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBZqwxfANm1bXIzey-1p5UU4TuuBdr9VX8",
    authDomain: "bfm-sandbox.firebaseapp.com",
    projectId: "bfm-sandbox",
    storageBucket: "bfm-sandbox.appspot.com",
    messagingSenderId: "976350951517",
    appId: "1:976350951517:web:bd26f986b1877c1038f5b4"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);  // Token was not returning the actual value it was null, so its fixed up

export {auth};