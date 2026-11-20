import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyABmM0Wpp0iaC5ig185PKasXSSBw34gPNo',
  authDomain: 'entre-nosotros-6f9a9.firebaseapp.com',
  projectId: 'entre-nosotros-6f9a9',
  storageBucket: 'entre-nosotros-6f9a9.firebasestorage.app',
  messagingSenderId: '390048118952',
  appId: '1:390048118952:web:1356d4ad5e9b4538122a9d',
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
