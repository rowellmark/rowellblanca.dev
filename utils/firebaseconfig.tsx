import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC4ebKScsetekKxPnnobXLoAXyiSdhZWtM",
  authDomain: "rowellblancadev-ec2ba.firebaseapp.com",
  databaseURL: "https://rowellblancadev-ec2ba-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "rowellblancadev-ec2ba",
  storageBucket: "rowellblancadev-ec2ba.appspot.com",
  messagingSenderId: "224118974447",
  appId: "1:224118974447:web:1dce36d4cfd5b91270781a",
  measurementId: "G-XWQVTC4XWZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };