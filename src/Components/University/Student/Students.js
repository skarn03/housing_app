import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom"; // Import navigation hook
import axios from "axios";
import { motion } from "framer-motion";
import {
    FaMapMarkerAlt, FaUser, FaIdBadge, FaBuilding, FaCalendarAlt, FaMoneyBill, FaSearch, FaPlus
} from "react-icons/fa";
import AddStudentForm from "./AddStudentForm";
import { AuthContext } from "../../../Hooks/AuthContext";

export default function Students({ universityData }) {
    const auth = useContext(AuthContext);
    const navigate = useNavigate(); // Initialize navigation
    const [expanded, setExpanded] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const backendURL = process.env.BACKEND_URL || "http://localhost:8000/api/";

    // Fetch students with pagination and multiple filters
    useEffect(() => {
        const fetchStudents = async () => {
            if (!universityData || !auth.token) return;
            setLoading(true);
            setError(null);
            
            try {
                console.log("📡 Fetching students with multiple filters...");
                
                const response = await axios.get(`${backendURL}student/getStudents`, {
                    params: {
                        universityId: universityData._id,
                        search: searchTerm,
                        page,
                        limit: 10
                    },
                    headers: {
                        "Authorization": `Bearer ${auth.token}`,
                        "Content-Type": "application/json"
                    }
                });

                setStudents(response.data.students);
                setTotalPages(response.data.totalPages);
                console.log("✅ Students fetched:", response.data.students);
            } catch (err) {
                console.error("❌ Error fetching students:", err);
                setError("Failed to load students.");
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, [universityData, searchTerm, page, auth.token]);

    const addStudent = (newStudent) => {
        setStudents((prevStudents) => [newStudent, ...prevStudents]);
        setShowForm(false);
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="p-6 font-Poppins">
            <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
                <div className="relative w-full md:w-1/2">
                    <input
                        type="text"
                        placeholder="Search (comma-separated)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <FaSearch className="absolute right-3 top-3 text-gray-500" />
                </div>
                <button onClick={() => setShowForm(true)} className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600 transition">
                    <FaPlus /> Add Student
                </button>
            </div>

            {showForm && <AddStudentForm onSave={addStudent} onClose={() => setShowForm(false)} universityData={universityData} />}

            {loading ? (
                <p className="text-center text-gray-500">Loading students...</p>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 place-items-center">
                    {students.length === 0 ? (
                        <p className="text-center text-gray-500">No students found.</p>
                    ) : (
                        students.map((student) => (
                            <motion.div key={student.studentNumber} className="relative w-[300px] bg-white text-black rounded-2xl shadow-lg border border-gray-300 transition-all transform hover:scale-105 overflow-hidden p-6">
                                <div className="relative flex justify-center">
                                    <img src={student.picture} alt={student.preferredName} className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover" />
                                </div>
                                <div className="text-center text-gray-500 text-sm mt-2 flex items-center justify-center">
                                    <FaMapMarkerAlt className="mr-2" /> {student.building}, Floor {student.floor}
                                </div>

                                <div className="text-center mt-3">
                                    <h3 className="text-xl font-bold">{student.preferredName} {student.lastName}</h3>
                                    <p className="text-gray-500">{student.entryStatus}</p>
                                    <button 
                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4 hover:bg-blue-600 transition"
                                        onClick={() => navigate(`/student/${student.studentNumber}`)} // Navigate to Student Profile
                                    >
                                        View Profile
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            )}

            {/* Pagination Controls */}
            <div className="flex justify-center mt-6 space-x-4">
                <button
                    className={`px-4 py-2 rounded ${page === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"}`}
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                >
                    Previous
                </button>
                <span>Page {page} of {totalPages}</span>
                <button
                    className={`px-4 py-2 rounded ${page === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"}`}
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages}
                >
                    Next
                </button>
            </div>
        </motion.div>
    );
}
