import admin from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore, QueryDocumentSnapshot, FirestoreDataConverter } from 'firebase-admin/firestore';
import { Award, Category } from './types';
import dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = {
    credential: admin.credential.cert(require('../../firebaseAccount.json'))
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
firestore.settings({ignoreUndefinedProperties: true});

const converter = <T>() => ({
    toFirestore: (data: Partial<T>) => data,
    fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as T
}) as FirestoreDataConverter<T>;
  
const dataPoint = <T>(collectionPath: string) => firestore.collection(collectionPath).withConverter(converter<T>())
  
const db = {
    awards: dataPoint<Award>('/awards'),
    categories: (awardId: string) => dataPoint<Category>(`awards/${awardId}/categories`)
}

export {db};