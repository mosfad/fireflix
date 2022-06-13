import { auth } from '../firebase/firebase';
import { FirebaseError } from 'firebase/app';
import { AppUser, ErrorProps } from '../shared/types';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  UserCredential,
  User as FirebaseUser,
  User,
} from 'firebase/auth';

const user: User | null = auth?.currentUser;

export const createUser = async (
  email: string,
  password: string,
  name: string,
  photoUrl: string = ''
): Promise<AppUser | void | ErrorProps> => {
  try {
    const userCred: UserCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const { displayName, uid, photoURL } = userCred?.user;
    return { displayName, email, uid, photoURL };
  } catch (error) {
    if (error instanceof FirebaseError) {
      const errorCode = error.code;
      const errorMessage = error.message;
      return { code: errorCode, message: errorMessage };
    }
  }
};

export const updateUserProfile = async (
  name: string,
  photoUrl: string = ''
): Promise<void | ErrorProps> => {
  try {
    // type guard function to make sure current user is not null.
    const isSignedIn = (currUser: User | null): currUser is User => {
      return typeof currUser?.uid === 'string';
    };
    if (isSignedIn(user)) {
      await updateProfile(user, {
        displayName: name,
        photoURL: photoUrl,
      });
    }
  } catch (error) {
    if (error instanceof FirebaseError) {
      const errorCode = error.code;
      const errorMessage = error.message;
    }
  }
};

export const signinUser = async (
  email: string,
  password: string
): Promise<AppUser | void | ErrorProps> => {
  try {
    const userCred: UserCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const { displayName, uid, photoURL } = userCred?.user;
    return { displayName, email, uid, photoURL };
  } catch (error) {
    if (error instanceof FirebaseError) {
      const errorCode = error.code;
      const errorMessage = error.message;
      return { code: errorCode, message: errorMessage };
    }
  }
};

// should also return error❗
export const signoutUser = () => {
  return signOut(auth)
    .then(() => {
      //...........setUser(null);
    })
    .catch((error) => {
      if (error instanceof FirebaseError) {
        const errorCode = error.code;
        const errorMessage = error.message;
      }
    });
};

// dispatch auth state listener in app.tsx. => Not used yet❗
export const authListener = async () => {
  await onAuthStateChanged(auth, (user) => {
    // update authd user
    // update log in status
  });
};
