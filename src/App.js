import React, { useContext, useState, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify"; // <-- import
import "react-toastify/dist/ReactToastify.css";   // <-- import CSS

import { AuthContext } from "./Hooks/AuthContext";
import { useAuth } from "./Hooks/useAuth";
import University from "./Components/University/University";
import Loader from "./Components/Loading/Loading";
import Home from "./Components/Home/Home";
import StudentProfile from "./Components/University/Student/StudentProfile";
import SignInPage from "./Components/Login/Login";

function App() {
  const { token, login, logout, userID } = useAuth();
  const auth = useContext(AuthContext);

  // Route security based on if logged in or not
  let routes;
  if (token) {
    routes = (
      <React.Fragment>
        <Route path="/" element={<Home />} />
        <Route path="/home/:university" element={<University />} />
        <Route path="/login/:university" element={<SignInPage />} />
        <Route path="/student/:studentID" element={<StudentProfile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </React.Fragment>
    );
  } else {
    routes = (
      <React.Fragment>
        <Route path="/" element={<Home />} />
        <Route path="/student/:studentID" element={<StudentProfile />} />
        <Route path="/login/:university" element={<SignInPage />} />
        <Route path="*" element={<Navigate to="/login/:university" replace />} />
      </React.Fragment>
    );
  }

  if (token) {
    return (
      <AuthContext.Provider
        value={{
          isLoggedIn: !!token,
          token: token,
          userID: userID,
          login: login,
          logout: logout,
        }}
      >
        <Router>
          {/* ToastContainer goes at the top level */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />

          <div className="extender">
            <Suspense fallback={<Loader />}>
              <Routes>{routes}</Routes>
            </Suspense>
          </div>
        </Router>
      </AuthContext.Provider>
    );
  } else {
    return (
      <AuthContext.Provider
        value={{
          isLoggedIn: !!token,
          token: token,
          userID: userID,
          login: login,
          logout: logout,
        }}
      >
        <Router>
          {/* ToastContainer goes here as well, so it exists even if user not logged in */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />

          <Suspense fallback={<Loader />}>
            <Routes>{routes}</Routes>
          </Suspense>
        </Router>
      </AuthContext.Provider>
    );
  }
}

export default App;
