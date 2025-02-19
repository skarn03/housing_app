import { motion } from 'framer-motion';
import { FaSearch, FaHome, FaUser, FaCog, FaInfoCircle, FaBars, FaTimes } from 'react-icons/fa';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../../Media/logo.png';
import { AuthContext } from '../../Hooks/AuthContext';

export default function Navbar() {
    const auth = useContext(AuthContext);
    const [search, setSearch] = useState('');
    const [debounceTimeout, setDebounceTimeout] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        if (search.trim() !== '') {
            const timeout = setTimeout(() => {
                fetchSearchResults(search);
            }, 1500);
            setDebounceTimeout(timeout);
        }
    }, [search]);

    const fetchSearchResults = async (query) => {
        try {
            if (!query.trim()) {
                setSearchResults([]);
                setHasSearched(false);
                return;
            }

            const backendURL = process.env.BACKEND_URL || 'http://localhost:5000';
            const response = await axios.get(`${backendURL}/api/universities/search/${query}`);

            if (response.data.length > 0) {
                setSearchResults(response.data);
            } else {
                setSearchResults([]);
            }
            setHasSearched(true);
        } catch (error) {
            console.error('Error fetching search results:', error);
            setSearchResults([]);
            setHasSearched(true);
        }
    };

    const handleUniversityClick = (universityName) => {
        if (auth.isLoggedIn) {
            navigate(`/home/${encodeURIComponent(universityName)}`);
        } else {
            navigate(`/login/${encodeURIComponent(universityName)}`);

        }
    };

    return (
        <>
            <motion.nav
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                className="bg-[#a8a69f] fixed w-full top-0 shadow-md z-50 font-Poppins font-montserrat"
            >
                <div className="container mx-auto flex justify-between items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: 'easeInOut' }}
                        className="text-black text-2xl font-bold flex items-center space-x-2"
                    >
                        <img src={logo} alt="App Logo" className="h-20" />
                        <span>Housta</span>
                    </motion.div>
                </div>
            </motion.nav>

            <div className="relative h-screen flex items-center justify-center bg-cover bg-center font-montserrat"
                style={{ backgroundImage: "url('https://www.decorilla.com/online-decorating/wp-content/uploads/2023/10/Neutral-wabi-sabi-interior-design-ideas_by_Decorilla-scaled.jpeg')" }}>
                <div className="absolute inset-0 bg-gray-900 opacity-40"></div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                    className="relative text-center text-white p-4 md:p-0"
                >
                    <motion.h1
                        initial={{ opacity: 0, y: -40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: 'easeInOut' }}
                        className="text-4xl sm:text-5xl md:text-6xl font-extrabold uppercase"
                    >
                        Modern Housing Solutions
                    </motion.h1>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: 'easeInOut', delay: 0.3 }}
                        className="relative w-full sm:w-3/4 md:w-1/2 mx-auto mt-6"
                    >
                        <input
                            type="text"
                            placeholder="Search for universities..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full p-3 sm:p-4 pl-12 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        />
                        <FaSearch className="absolute right-4 top-5 text-gray-500" />
                    </motion.div>
                    {(hasSearched && searchResults.length > 0) ? (
                        <div className="mt-4 text-black bg-white p-4 rounded-lg shadow-md max-w-md mx-auto">
                            <ul>
                                {searchResults.map((university, index) => (
                                    <li key={index}
                                        className="py-2 cursor-pointer hover:bg-gray-200 px-2 rounded"
                                        onClick={() => handleUniversityClick(university.name)}
                                    >
                                        {university.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : hasSearched && (
                        <div className="mt-4 text-white bg-gray-700 p-4 rounded-lg shadow-md max-w-md mx-auto">
                            No results found.
                        </div>
                    )}
                </motion.div>
            </div>
        </>
    );
}