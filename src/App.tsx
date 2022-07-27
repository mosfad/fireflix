import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NavBar } from './components/NavBar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import PrivateRoute from './routes/PrivateRoute';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './material/theme';
import { useAppSelector, useAppDispatch } from './app/hooks';
import {
  fetchTrendingMovies,
  selectAllMovies,
  selectMovieStatus,
} from './features/movies/moviesSlice';
import {
  selectAuthUser,
  selectAuthError,
  selectLoginStatus,
  updateLoginStatus,
  updateUser,
} from './features/auth/authSlice';
// import { authListener } from './features/users/servicesFirebase';
import { AuthProvider } from './hooks/useAuth';
import './App.css';
import './images/appBackground.jpg';
import LoadingSpinner from './components/LoadingSpinner';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/firebase';
import { AppUser } from './shared/types';
import { MediaDetailsPage } from './pages/MediaDetailsPage';

function App() {
  const dispatch = useAppDispatch();
  const movieStatus = useAppSelector((state) => selectMovieStatus(state));
  const movieArray = useAppSelector((state) => selectAllMovies(state));

  const error = useAppSelector((state) => selectAuthError(state));

  // let auth listener run when the app is mounted
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const displayName = user?.displayName;
      const email = user?.email;
      const uid = user?.uid;
      const photoURL = user?.photoURL;
      //
      if (user && !error) {
        dispatch(updateUser({ displayName, email, uid, photoURL }));
        dispatch(updateLoginStatus(true));
      } else {
        dispatch(updateUser(user));
        dispatch(updateLoginStatus(false));
      }
    });

    // cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <div className="App">
        <AuthProvider>
          <ThemeProvider theme={theme}>
            <NavBar />
            {/* {movieStatus === 'pending' && <LoadingSpinner />} */}
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <DashboardPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/:mediaTitle/:mediaId"
                element={
                  <PrivateRoute>
                    <MediaDetailsPage />
                  </PrivateRoute>
                }
              />
            </Routes>
            <Footer />
          </ThemeProvider>
        </AuthProvider>
      </div>
    </BrowserRouter>
  );
}

export default App;
