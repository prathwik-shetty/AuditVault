import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCK9i3QInw6AsspdLQbzMCOjptjLs2cFo0",
  authDomain: "auditvault-25052.firebaseapp.com",
  projectId: "auditvault-25052",
  storageBucket: "auditvault-25052.firebasestorage.app",
  messagingSenderId: "967616488652",
  appId: "1:967616488652:web:848520c27469bb5e018e69",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);