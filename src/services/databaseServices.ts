import { db } from '../firebase/firebase';
import { FirebaseError } from 'firebase/app';
import { AppUser, ErrorProps } from '../shared/types';
import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  Timestamp,
  DocumentData,
  getDocs,
  where,
  query,
} from 'firebase/firestore';
import { DockSharp } from '@mui/icons-material';

export const addUserDB = async (
  name: string,
  email: string,
  uid: string
): Promise<void | ErrorProps> => {
  try {
    await setDoc(doc(db, 'users', uid), {
      email,
      uid,
      name,
      createdAt: Timestamp.now(),
    });
  } catch (error) {
    if (error instanceof FirebaseError) {
      const errorCode = error.code;
      const errorMessage = error.message;
      return { code: errorCode, message: errorMessage };
    }
  }
};

export const getUserDB = async (
  docName: string
): Promise<DocumentData | undefined> => {
  try {
    const docSnap = await getDoc(doc(db, 'users', docName));
    if (docSnap.exists()) {
      console.log(docSnap.data());
      return docSnap.data();
    }
  } catch (error) {
    console.log('Document does not exist');
  }
};

export const getUserFav = async (
  userId: string
): Promise<DocumentData | undefined> => {
  try {
    // let favsArr = [];
    const favsRef = collection(db, `users/${userId}/favorites`);
    const favsQuery = query(favsRef);
    const querySnapshot = await getDocs(favsQuery);
    console.log(querySnapshot.docs);
    return querySnapshot.docs.map((doc) => doc.data());
    // return querySnapshot.map(doc => {
    //     return doc.data();
    // })
    // querySnapshot.forEach((doc) => {
    //   // doc.data() is never undefined for query doc snapshots
    //   console.log(doc.id, ' => ', doc.data());
    // });
  } catch (error) {
    console.log('Document does not exist');
  }
};
