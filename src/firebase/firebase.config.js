import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDd0nanhoUQ2k-M5hqGHSn5qIWICiFGSgs",
  authDomain: "nxmsignature.firebaseapp.com",
  projectId: "nxmsignature",
  storageBucket:"nxmsignature.appspot.com",
  messagingSenderId: "820402446121",
  appId: "1:820402446121:web:e1d5b392f33fdcfcf3a138",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
