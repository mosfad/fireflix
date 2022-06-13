import { Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  selectAuthUser,
  selectLoginStatus,
  selectAuthStatus,
} from '../features/auth/authSlice';
// import { useAuth } from '../hooks/useAuth';

const PrivateRoute = ({ children }: { children: JSX.Element }): JSX.Element => {
  let location = useLocation();
  let navigate = useNavigate();

  const user = useAppSelector((state) => selectAuthUser(state));
  const isLoggedin = useAppSelector((state) => selectLoginStatus(state));
  const isAuthenticating = useAppSelector((state) => selectAuthStatus(state));

  if (!user && !isLoggedin && isAuthenticating) {
    return <LoadingSpinner />;
  }

  if (!user && !isLoggedin && !isAuthenticating) {
    // if user is not signed in
    // navigate('/login', { replace: true });
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;

// const PrivateRoute = ({ children }: { children: JSX.Element }): JSX.Element => {
//   let auth = useAuth();
//   let location = useLocation();
//   let navigate = useNavigate();
//   console.log(auth);
//   console.log(auth?.user);
//   if (!auth?.user && auth?.isAuthenticating) {
//     return <LoadingSpinner />;
//   }
//   if (!auth?.user && !auth?.isAuthenticating) {
//     // if user is not signed in
//     // navigate('/login', { replace: true });
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }
//   return children;
// };

// export default PrivateRoute;
