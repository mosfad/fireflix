import { auth } from '../firebase/firebase';
import { FirebaseError } from 'firebase/app';
import { AppUser, ErrorProps } from '../shared/types';
import { useAuth } from '../hooks/useAuth';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  reauthenticateWithCredential,
  updateEmail,
  updateProfile,
  UserCredential,
  deleteUser,
  AuthCredential,
  EmailAuthProvider,
  User as FirebaseUser,
  User,
  updatePassword,
} from 'firebase/auth';

const user: User | null = auth?.currentUser;

export const getCurrentUser = () => auth?.currentUser;

export const reauthenticateUserCred = async (
  currentUser: FirebaseUser | null,
  email: string,
  password: string
): Promise<UserCredential | void | ErrorProps> => {
  try {
    // make sure User is not null
    // type guard function to make sure current user is not null.
    const hasCurrUser = (
      currUser: FirebaseUser | null
    ): currUser is FirebaseUser => {
      return typeof currUser?.uid === 'string';
    };
    // get AuthCredential
    if (!hasCurrUser(currentUser)) return;
    const authCred: AuthCredential = EmailAuthProvider.credential(
      email,
      password
    );
    const userCred: UserCredential = await reauthenticateWithCredential(
      currentUser,
      authCred
    );
    // To do: I need the new UserCredentials to perform sensitive actions**
    // Can't use RTK because of serialization restrictions.
    // Maybe bypass RTK....
    return userCred;
  } catch (error) {
    if (error instanceof FirebaseError) {
      const errorCode = error.code;
      const errorMessage = error.message;
      // will return as resolved; I need to throw an error to get
      // an actual error.🌟
      return { code: errorCode, message: errorMessage };
    }
  }
};

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
  currentUser: FirebaseUser | null,
  name: string,
  photoUrl: string = ''
): Promise<void | ErrorProps> => {
  try {
    //console.log('user signed in', name, photoUrl, currentUser);
    // type guard function to make sure current user is not null.
    const isSignedIn = (
      currUser: FirebaseUser | null
    ): currUser is FirebaseUser => {
      return typeof currUser?.uid === 'string';
    };
    if (isSignedIn(currentUser)) {
      //console.log('user is signed in');
      await updateProfile(currentUser, {
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

export const updateUserEmail = async (
  newEmail: string
): Promise<void | ErrorProps> => {
  try {
    // type guard function to make sure current user is not null.
    const isSignedIn = (currUser: User | null): currUser is User => {
      return typeof currUser?.uid === 'string';
    };
    if (isSignedIn(user)) {
      await updateEmail(user, newEmail);
    }
  } catch (error) {
    if (error instanceof FirebaseError) {
      const errorCode = error.code;
      const errorMessage = error.message;
    }
  }
};

export const updateUserPassword = async (
  newPassword: string
): Promise<void | ErrorProps> => {
  try {
    // type guard function to make sure current user is not null.
    const isSignedIn = (currUser: User | null): currUser is User => {
      return typeof currUser?.uid === 'string';
    };
    if (isSignedIn(user)) {
      await updatePassword(user, newPassword);
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

export const deleteUserAccount = async (
  currUser: FirebaseUser | null
): Promise<void | ErrorProps> => {
  try {
    // type guard function to make sure current user is not null.
    const isSignedIn = (
      currentUser: FirebaseUser | null
    ): currentUser is FirebaseUser => {
      return typeof currentUser?.uid === 'string';
    };
    console.log(currUser);
    if (isSignedIn(currUser)) {
      await deleteUser(currUser);
    }
  } catch (error) {
    console.log(error);
    if (error instanceof FirebaseError) {
      const errorCode = error.code;
      const errorMessage = error.message;
    }
  }
};

// dispatch auth state listener in app.tsx. => Not used yet❗
export const authListener = async () => {
  await onAuthStateChanged(auth, (user) => {
    // update authd user
    // update log in status
  });
};
