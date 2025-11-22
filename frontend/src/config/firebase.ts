import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
 apiKey: "AIzaSyA1rx7kfQRlsflZbM_iUQpEweoaRJ-hi1M",
  authDomain: "agroconectav2.firebaseapp.com",
  projectId: "agroconectav2",
  storageBucket: "agroconectav2.firebasestorage.app",
  messagingSenderId: "604661762031",
  appId: "1:604661762031:web:4d028fcf84945c647dd81a",
  measurementId: "G-CZT5TYEWSK"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);