import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBrtTQt1lm80T7lzTQlj3osCzKt-NEWMUA",
  authDomain: "hrcrm-8aabd.firebaseapp.com",
  projectId: "hrcrm-8aabd",
  storageBucket: "hrcrm-8aabd.firebasestorage.app",
  messagingSenderId: "907728621436",
  appId: "1:907728621436:web:49aff315588603ee095ef9",
  measurementId: "G-R8Y32Z2SKT"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
