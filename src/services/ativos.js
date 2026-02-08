import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';

const COLLECTION_NAME = 'ativos';

export const createAtivo = async (userId, ativoData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...ativoData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, error: null };
  } catch (error) {
    return { id: null, error: error.message };
  }
};

export const updateAtivo = async (ativoId, ativoData) => {
  try {
    const ativoRef = doc(db, COLLECTION_NAME, ativoId);
    await updateDoc(ativoRef, {
      ...ativoData,
      updatedAt: serverTimestamp()
    });
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

export const deleteAtivo = async (ativoId) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, ativoId));
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

export const getUserAtivos = async (userId) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const ativos = [];
    querySnapshot.forEach((doc) => {
      ativos.push({ id: doc.id, ...doc.data() });
    });
    return { ativos, error: null };
  } catch (error) {
    return { ativos: [], error: error.message };
  }
};
