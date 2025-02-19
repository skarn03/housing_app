import React, { useContext, useState, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
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
  //route security based on if logged in or not
  let routes;
  if (token) {
    routes = (
      <React.Fragment>
        <Route path="/" element={<Home />} />
        <Route path="/home/:university" element={<University />} />
        <Route path="/login/:university" element={<SignInPage />} />
        <Route path="/student/:studentID" element={< StudentProfile/>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </React.Fragment>
    );
  } else {
    routes = (
      <React.Fragment>
        <Route path="/" element={<Home />} />
        <Route path="/student/:studentID" element={< StudentProfile/>} />

        <Route path="/login/:university" element={<SignInPage />} />
        <Route path="*" element={<Navigate to="/login/:university" replace />} />

      </React.Fragment>
    );
  }


  if (token) {
    return (

      <AuthContext.Provider value={{ isLoggedIn: !!token, token: token, userID: userID, login: login, logout: logout }}>
        <Router>


          <div className="extender">
            <Suspense>
              <Routes>
                {routes}
              </Routes>
            </Suspense>
          </div>



        </Router>

      </AuthContext.Provider>
    );
  } else {
    return (<AuthContext.Provider value={{ isLoggedIn: !!token, token: token, userID: userID, login: login, logout: logout }}>
      <Router>
        <Suspense fallback={
          <div className="center">
          </div>}>
          <Routes>
            {routes}
          </Routes>
        </Suspense>

      </Router>

    </AuthContext.Provider>)
  }

}

export default App;
