import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBd7TYrijn0pmi27gYNcr0MAO-WIWTRxow",
  authDomain: "gosupportme2.firebaseapp.com",
  databaseURL: "https://gosupportme2-default-rtdb.firebaseio.com",
  projectId: "gosupportme2",
  storageBucket: "gosupportme2.firebasestorage.app",
  messagingSenderId: "131300377640",
  appId: "1:131300377640:web:9eaeaecf62860ddc02211d",
  measurementId: "G-VN0YRG6YY0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);
export default app;
