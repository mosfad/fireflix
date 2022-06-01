import { Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';

const PrivateRoute = ({ children }: { children: JSX.Element }): JSX.Element => {
  let auth = useAuth();
  let location = useLocation();
  let navigate = useNavigate();
  console.log(auth);
  console.log(auth?.user);
  if (!auth?.user && auth?.isAuthenticating) {
    return <LoadingSpinner />;
  }
  if (!auth?.user && !auth?.isAuthenticating) {
    // if user is not signed in
    // navigate('/login', { replace: true });
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

export default PrivateRoute;
