import { useState, useEffect, useContext, createContext } from 'react';
import { auth, db } from '../firebase/firebase';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  UserCredential,
  User,
} from 'firebase/auth';
import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import { Unsubscribe } from '@mui/icons-material';
import { date } from 'yup/lib/locale';

// type User = {
//   uid: string;
// } | null; // **temporary fix!!!

type AuthContextHook = {
  createUser: (
    email: string,
    password: string,
    name: string,
    photoURL: string
  ) => Promise<void>;
  logoutUser: () => Promise<void>;
  isAuthenticating: boolean;
  signinUser: (email: string, password: string) => Promise<void>;
  user: User | null; // should be type of User, which is unkown
} | null;

// type AuthContextType = unknown | null;

type AuthProviderProps = {
  children: React.ReactNode;
};

// create auth context
const AuthContext = createContext<AuthContextHook>(null);

// hook gives child components access to auth object
export const useAuth = () => useContext(AuthContext);

// provider hook creates auth object & handles state
const useAuthProvider = () => {
  const [user, setUser] = useState<User | null>(null); // ** temporary fix!!!
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  const createUser = async (
    email: string,
    password: string,
    name: string,
    photoUrl: string = ''
  ): Promise<void> => {
    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const currUser = userCred?.user;
      //.................setUser(currUser);
      await updateProfile(currUser, { displayName: name, photoURL: photoUrl });
      await setDoc(doc(db, 'users', currUser?.uid), {
        email,
        id: currUser?.uid,
        name,
        createdAt: Timestamp.now(),
      });
    } catch (error) {
      if (error instanceof Error) {
        // const errorCode = error.code;
        const errorMessage = error.message;
      }
    }
  };
  // const createUser = (
  //   email: string,
  //   password: string,
  //   name: string,
  //   photoUrl: string = ''
  // ) => {
  //   return createUserWithEmailAndPassword(auth, email, password)
  //     .then((userCredential) => {
  //       // Signed in
  //       // setUser(userCredential.user)
  //       // setUser((prevState) => {
  //       //   return { ...prevState, ...userCredential.user };
  //       // });
  //       // return user;
  //       console.log(userCredential.user);
  //       return updateProfile(userCredential.user, {
  //         displayName: name,
  //         photoURL: photoUrl,
  //       });
  //       // ...
  //     })
  //     .then(() => {
  //       if (typeof user === 'object' && user !== null) {
  //         console.log(user);
  //         return setDoc(doc(db, 'users', user?.uid), {
  //           email,
  //           id: user?.uid,
  //           name,
  //           createdAt: Timestamp.now(),
  //         });
  //       }
  //     })
  //     .catch((error) => {
  //       const errorCode = error.code;
  //       const errorMessage = error.message;
  //       // ..
  //     });
  // };

  const signinUser = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // User is signed in
        // ......setUser(userCredential.user);
        // return;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };

  const logoutUser = () => {
    return signOut(auth)
      .then(() => {
        //...........setUser(null);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };

  // const updateProfileUser = (
  //   userName: string,
  //   photoUrl: string,
  //   phoneNumber: number
  // ) => {
  //   return updateProfile(auth?.currentUser, {
  //     displayName: userName,
  //     photoURL: photoUrl,
  //     phoneNumber,
  //   })
  //     .then(() => {
  //       //profile updated
  //     })
  //     .catch((error) => {
  //       // error occured
  //     });
  // };

  // subscribe user on mount to have access to most recent
  // auth object, so that components can re-render appropriately
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) setIsAuthenticating(false);
      else setIsAuthenticating(true);
    });

    // cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const values = {
    createUser,
    logoutUser,
    isAuthenticating,
    signinUser,
    user,
  };
  return values;
};

// provider component wraps app & makes auth object available
// to components that call useAuth()
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const auth = useAuthProvider();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
