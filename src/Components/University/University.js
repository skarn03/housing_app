import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { FaUsers, FaBuilding, FaBox, FaExclamationTriangle, FaHome } from "react-icons/fa";
import StudentConnection from "./StudentConnection";
import Students from "./Student/Students";
import Packages from "./Package/Packages";
import IncidentReports from "./IncidentReports";
import Buildings from "./Building/Building"; // Import new Buildings component

export default function University() {
    const { university } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [universityData, setUniversityData] = useState(null);
    const [activeTab, setActiveTab] = useState("studentConnection");
    const [menuOpen, setMenuOpen] = useState(false);

    // Fetch university data
    useEffect(() => {
        const fetchUniversityData = async () => {
            try {
                const backendURL = process.env.BACKEND_URL || "http://localhost:8000";
                const response = await axios.get(`${backendURL}/api/universities/university/${encodeURIComponent(university)}`);
                setUniversityData(response.data);
            } catch (error) {
                console.error("Error fetching university data:", error);
            }
        };
        fetchUniversityData();
    }, [university]);

    // Update URL when tab changes
    useEffect(() => {
        navigate(`?tab=${activeTab}`, { replace: true });
    }, [activeTab, navigate]);

    // Tabs for sections
    const tabs = [
        { id: "studentConnection", label: "Student Connection", icon: <FaBuilding className="mr-2" /> },
        { id: "students", label: "Students", icon: <FaUsers className="mr-2" /> },
        { id: "packages", label: "Packages", icon: <FaBox className="mr-2" /> },
        { id: "incidentReports", label: "Incident Reports", icon: <FaExclamationTriangle className="mr-2" /> },
        { id: "buildings", label: "Buildings", icon: <FaHome className="mr-2" /> }, // New Buildings Tab
    ];

    return (
        <div className="min-h-screen flex flex-col bg-white font-Poppins">
            {/* Navbar */}
            <nav className="bg-white text-black py-4 px-6 flex justify-between items-center shadow-md border-b border-gray-300">
                <h1 className="text-2xl font-bold uppercase tracking-wide">
                    {universityData ? universityData.name : university}
                </h1>
                {/* Hamburger Menu (Mobile) */}
                <button className="lg:hidden p-2 text-black" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </nav>

            <div className="flex flex-1">
                {/* Sidebar Navigation (Desktop) */}
                <aside className="hidden lg:flex flex-col w-72 bg-gray-100 text-black shadow-lg p-6 border-r border-gray-300 min-h-screen">
                    <h2 className="text-lg font-semibold mb-4 uppercase tracking-wider text-gray-600">Navigation</h2>
                    <div className="space-y-2">
                        {tabs.map((tab) => (
                            <motion.button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center w-full text-left px-4 py-3 rounded-lg font-medium transition-all ${activeTab === tab.id ? "bg-black text-white shadow-lg" : "text-gray-700 hover:bg-gray-200"
                                    }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {tab.icon} {tab.label}
                            </motion.button>
                        ))}
                    </div>
                </aside>

                {/* Sidebar (Mobile) */}
                <AnimatePresence>
                    {menuOpen && (
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ duration: 0.3 }}
                            className="fixed top-0 left-0 w-72 h-full bg-gray-100 text-black shadow-lg p-6 border-r border-gray-300 z-50"
                        >
                            <button className="absolute top-4 right-4 p-2 text-black" onClick={() => setMenuOpen(false)}>
                                <X size={28} />
                            </button>
                            <h2 className="text-lg font-semibold mb-4 uppercase tracking-wider text-gray-600">Navigation</h2>
                            <div className="space-y-2">
                                {tabs.map((tab) => (
                                    <motion.button
                                        key={tab.id}
                                        onClick={() => {
                                            setActiveTab(tab.id);
                                            setMenuOpen(false);
                                        }}
                                        className={`flex items-center w-full text-left px-4 py-3 rounded-lg font-medium transition-all ${activeTab === tab.id ? "bg-black text-white shadow-lg" : "text-gray-700 hover:bg-gray-200"
                                            }`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {tab.icon} {tab.label}
                                    </motion.button>
                                ))}
                            </div>
                        </motion.aside>
                    )}
                </AnimatePresence>

                {/* Main Content */}
                <main className="flex-1 p-4">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white md:p-8 rounded-xl shadow-lg border border-gray-200"
                    >
                        {activeTab === "studentConnection" && <StudentConnection universityData={universityData} />}
                        {activeTab === "students" && <Students universityData={universityData} />}
                        {activeTab === "packages" && <Packages universityData={universityData} />}
                        {activeTab === "incidentReports" && <IncidentReports universityData={universityData} />}
                        {activeTab === "buildings" && <Buildings universityData={universityData} />} {/* New Buildings Section */}
                    </motion.div>
                </main>
            </div>
        </div>
    );
}
