import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCV5fP47TK-TJZFbfPa0b_yO-cfzV8zmNY",
  authDomain: "gosupportme-f93e5.firebaseapp.com",
  databaseURL: "https://gosupportme-f93e5-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "gosupportme-f93e5",
  storageBucket: "gosupportme-f93e5.firebasestorage.app",
  messagingSenderId: "1005002352920",
  appId: "1:1005002352920:web:80b83be0cf2a36afa4966d",
  measurementId: "G-DML8PWKC7K"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);
export default app;
