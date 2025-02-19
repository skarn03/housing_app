import React, { useContext, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { AuthContext } from "./Hooks/AuthContext";
import { useAuth } from "./Hooks/useAuth";

import Loader from "./Components/Loading/Loading";
import Home from "./Components/Home/Home";
import SignInPage from "./Components/Login/Login";

function App() {
    const { token, login, logout, userID } = useAuth();
    const auth = useContext(AuthContext);

    // Define routes as variables
    const publicRoutes = (
        <>
            <Route path="/login" element={<SignInPage />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
        </>
    );

    const privateRoutes = (
        <>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </>
    );

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
                <Suspense fallback={<div className="center"><Loader /></div>}>
                    <Routes>{token ? privateRoutes : publicRoutes}</Routes>
                </Suspense>
            </Router>
        </AuthContext.Provider>
    );
}

export default App;
