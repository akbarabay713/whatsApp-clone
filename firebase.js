import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyDlf4VRgNUSn8wPA2zvxq1vZJNdfKvRfmM",
  authDomain: "whatsapp-clone-af323.firebaseapp.com",
  projectId: "whatsapp-clone-af323",
  storageBucket: "whatsapp-clone-af323.appspot.com",
  messagingSenderId: "823291286322",
  appId: "1:823291286322:web:c730189d0978258936fd2b",
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth();
const provider = new GoogleAuthProvider();

export { db, auth, provider };
