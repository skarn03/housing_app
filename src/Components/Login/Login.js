import React, { useState, useContext, useEffect } from 'react';
import useFetch from '../../Hooks/useFetch';
import Overlay from './Overlay';
import { AuthContext } from '../../Hooks/AuthContext';
import Loading from '../Loading/Loading';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const SignInPage = () => {
    const navigate = useNavigate();
    const { university } = useParams();
    const [universityData, setUniversityData] = useState(null);
    const [showOverlay, setShowOverlay] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const { isLoading, sendRequest } = useFetch();
    const auth = useContext(AuthContext);


    useEffect(() => {
        if (university) {
            fetchUniversityData(university);
        }
    }, [university]);

    const fetchUniversityData = async (universityName) => {
        try {
            const backendURL = process.env.BACKEND_URL || 'http://localhost:8000';
            const response = await axios.get(`${backendURL}/api/universities/university/${encodeURIComponent(universityName)}`);
            setUniversityData(response.data);
        } catch (error) {
            console.error('Error fetching university data:', error);
            setUniversityData(null);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSignIn = async () => {
        try {
            const backendURL = process.env.BACKEND_URL || 'http://localhost:8000/api/';
            console.log(`${backendURL}auth/login`);
            const response = await axios.post(`${backendURL}auth/login`, {
                email: formData.email,
                password: formData.password
            }, {
                headers: { 'Content-Type': 'application/json' }
            });
    
            console.log("Full Response:", response);
            console.log("Response Data:", response.data);
    
            toast.success('Sign In successful');
    
            if (!response?.data?.university) {
                console.error("❌ University is undefined or null!");
                return;
            }
            console.log(`/home/${encodeURIComponent(response?.data?.university)}`);
            auth.login(response.data.id, response.data.token);
            navigate(`/home/${encodeURIComponent(response?.data?.university)}`);

        } catch (error) {
            console.log("❌ Error during sign-in:", error.message);
        }
    };
    


    return (
        <div className="relative flex items-center justify-center h-screen bg-gradient-to-r from-gray-200 to-gray-400 overflow-hidden">
            {isLoading ? <Loading /> :
                <AnimatePresence mode="wait">
                    <motion.div
                        key="signInPage"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="bg-white shadow-lg rounded-3xl p-8 max-w-lg w-full"
                    >
                        <div className="flex flex-col items-center">
                            <motion.img
                                src={universityData?.logo || "https://www.scgreencharter.org/images/page/Green-Graduate.png"}
                                alt="University Logo"
                                className="h-20 w-20 object-contain mb-4"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                            />
                            <h2 className="text-2xl font-bold text-gray-900">{universityData ? universityData.name : "Eastern Housing"}</h2>
                        </div>
                        <p className="text-gray-700 text-center mt-4">Welcome back! Please enter your details</p>
                        <form className="mt-6 space-y-4">
                            <motion.div whileFocus={{ scale: 1.02 }}>
                                <label className="block text-sm font-medium text-gray-900">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-lg border-gray-300 p-3 shadow-sm focus:border-gray-500 focus:ring focus:ring-gray-300"
                                />
                            </motion.div>
                            <motion.div whileFocus={{ scale: 1.02 }}>
                                <label className="block text-sm font-medium text-gray-900">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-lg border-gray-300 p-3 shadow-sm focus:border-gray-500 focus:ring focus:ring-gray-300"
                                />
                            </motion.div>
                            <motion.button
                                type="button"
                                onClick={handleSignIn}
                                className="w-full bg-gray-600 text-white p-3 rounded-lg shadow-md hover:bg-gray-700 transition-all"
                                disabled={!universityData}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Sign in
                            </motion.button>
                        </form>
                    </motion.div>
                </AnimatePresence>
            }
        </div>
    );
};

export default SignInPage;
