import "../styles/globals.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import Login from "./login";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useEffect } from "react";

function MyApp({ Component, pageProps }) {
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      const userRef = doc(db, "users", user.uid);
      setDoc(
        userRef,
        {
          email: user.email,
          lastSeen: serverTimestamp(),
          photoURL: user.photoURL,
        },
        { merge: true }
      );
    }
  });

  if (!user) return <Login />;
  return <Component {...pageProps} />;
}

export default MyApp;
