import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDyPZ8DLYwZwyJ7v9qVD2-RrZPUYJATJes",
  authDomain: "app-noe-c7036.firebaseapp.com",
  projectId: "app-noe-c7036",
  storageBucket: "app-noe-c7036.firebasestorage.app",
  messagingSenderId: "829871387840",
  appId: "1:829871387840:web:605bd17707ba3c55e8e925",
  measurementId: "G-HCE702JK8Z"
};

// 🔥 Inicializa o app somente se ainda não existir
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// 🔐 Inicializa Auth com persistência no AsyncStorage
let auth;
if (!getApps().length) {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} else {
  auth = getAuth(app);
}

// 🗂️ Firestore
const db = getFirestore(app);

// 📦 Storage
const storage = getStorage(app);

// 🚀 Exports
export { app, auth, db, storage };

