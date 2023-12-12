import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NavBar } from "./components/NavBar";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { FavoritesPage } from "./pages/FavoritesPage";
import { UserAccountPage } from "./pages/UserAccountPage";
import PrivateRoute from "./routes/PrivateRoute";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./material/theme";
import { useAppSelector, useAppDispatch } from "./app/hooks";
import {
  fetchTrendingMovies,
  selectAllMovies,
  selectMovieStatus,
} from "./features/movies/moviesSlice";
import {
  selectAuthUser,
  selectAuthError,
  selectLoginStatus,
  updateLoginStatus,
  updateUser,
} from "./features/auth/authSlice";
// import { authListener } from './features/users/servicesFirebase';
import "./App.css";
import "./images/appBackground.jpg";
import LoadingSpinner from "./components/LoadingSpinner";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth } from "./firebase/firebase";
import { useAuth } from "./hooks/useAuth";
import { AppUser } from "./shared/types";
import { MediaDetailsPage } from "./pages/MediaDetailsPage";

function App() {
  const dispatch = useAppDispatch();
  // const movieStatus = useAppSelector((state) => selectMovieStatus(state));
  // const movieArray = useAppSelector((state) => selectAllMovies(state));

  const error = useAppSelector((state) => selectAuthError(state));
  // get firebase user from provider AuthProvider.
  const fbaseUser = useAuth()?.currUser; // value from auth provider = {currUser : FirebaseUser | null} | null

  useEffect(() => {
    if (fbaseUser) {
      console.log(fbaseUser);
      // console.log(currUser.currUser);
      const { displayName, email, uid, photoURL } = fbaseUser;
      dispatch(updateUser({ displayName, email, uid, photoURL }));
      dispatch(updateLoginStatus(true));
    } else {
      dispatch(updateUser(null));
      dispatch(updateLoginStatus(false));
    }
  }, [fbaseUser, dispatch]);

  useEffect(() => {
    let handleBeforeUnloaded = (ev: BeforeUnloadEvent) => {
      ev.preventDefault();
      console.log("Do not reload!!!");
      // setIsReloaded(true);
    };

    window.addEventListener("beforeunload", handleBeforeUnloaded);

    return () => {
      // setIsReloaded(false);
      window.removeEventListener("beforeunload", handleBeforeUnloaded);
    };
  }, []);

  return (
    <BrowserRouter>
      <div className="App">
        <ThemeProvider theme={theme}>
          <NavBar />
          {/* {movieStatus === 'pending' && <LoadingSpinner />} */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/favorites"
              element={
                <PrivateRoute>
                  <FavoritesPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/account"
              element={
                <PrivateRoute>
                  <UserAccountPage />
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
      </div>
    </BrowserRouter>
  );
}

export default App;
