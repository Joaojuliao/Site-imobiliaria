// src/services/firebase.js
//
// Configuração do Firebase — usa as variáveis VITE_PUBLIC_FIREBASE_*
// já presentes no .env do projeto.

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_PUBLIC_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);