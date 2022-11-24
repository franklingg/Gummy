import { initializeApp } from 'firebase-admin/app';
import { getFirestore, QueryDocumentSnapshot, FirestoreDataConverter } from 'firebase-admin/firestore';
import { Award } from './types';

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY, 
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

const converter = <T>() => ({
    toFirestore: (data: Partial<T>) => data,
    fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as T
}) as FirestoreDataConverter<T>;
  
const dataPoint = <T>(collectionPath: string) => firestore.collection(collectionPath).withConverter(converter<T>())
  
const db = {
    awards: dataPoint<Award>('awards'),
    // userPosts: (userId: string) => dataPoint<YourOtherType>(`users/${userId}/posts`)
}

export {db};