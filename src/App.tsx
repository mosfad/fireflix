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
import { useAppSelector } from './app/hooks';
import {
  fetchAllMovies,
  selectAllMovies,
  selectMovieStatus,
} from './features/movies/moviesSlice';
import { AuthProvider } from './hooks/useAuth';
import './App.css';
import './images/appBackground.jpg';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const movieStatus = useAppSelector((state) => selectMovieStatus(state));
  const movieArray = useAppSelector((state) => selectAllMovies(state));

  return (
    <BrowserRouter>
      <div className="App">
        <AuthProvider>
          <ThemeProvider theme={theme}>
            <NavBar />
            {movieStatus === 'pending' && <LoadingSpinner />}
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
            </Routes>
            <Footer />
          </ThemeProvider>
        </AuthProvider>
      </div>
    </BrowserRouter>
  );
}

export default App;
