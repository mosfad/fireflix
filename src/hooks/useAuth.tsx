import { useState, useEffect, useContext, createContext } from 'react';
import { auth } from '../firebase/firebase';
// import { FirebaseError } from 'firebase/app';
import { onAuthStateChanged, User as FirebaseUser, User } from 'firebase/auth';
// import { Unsubscribe } from '@mui/icons-material';
// import { date } from 'yup/lib/locale';

/*type ErrorProps = {
  code: string;
  message: string;
};*/

type AuthContextHook = {
  currUser: FirebaseUser | null; // should be type of User, which is unkown
};

// type AuthContextType = unknown | null;

type AuthProviderProps = {
  children: React.ReactNode;
};

// create auth context
const AuthContext = createContext<AuthContextHook | null>(null);

// hook gives child components access to auth object
export const useAuth = () => useContext(AuthContext);

// provider hook creates auth object & handles state via Firebase Auth
const useAuthProvider = () => {
  const [currUser, setCurrUser] = useState<FirebaseUser | null>(null); // ** temporary fix!!!
  // const [isAuthenticating, setIsAuthenticating] = useState(true);

  // subscribe user on mount to have access to most recent
  // auth object, so that components can re-render appropriately
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrUser(user);
    });

    // cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const values = { currUser };
  return values;
};

// provider component wraps app & makes auth object available
// to components that call useAuth()
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const auth = useAuthProvider();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
