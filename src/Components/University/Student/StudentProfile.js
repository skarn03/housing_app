import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { AuthContext } from "../../../Hooks/AuthContext";
import {
    FaEnvelope, FaMapMarkerAlt, FaBuilding, FaCalendarAlt, FaMoneyBill, FaUser, FaIdBadge
} from "react-icons/fa";

export default function StudentProfile() {
    const { studentID } = useParams();
    const auth = useContext(AuthContext);
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const backendURL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000/api/";

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                console.log(`📡 Fetching student data for ID: ${studentID}`);
                const response = await axios.get(`${backendURL}student/${studentID}`, {
                    headers: {
                        "Authorization": `Bearer ${auth.token}`,
                        "Content-Type": "application/json"
                    }
                });
                setStudent(response.data);
                console.log("✅ Student data fetched:", response.data);
            } catch (error) {
                console.error("❌ Error fetching student:", error);
                setError("Failed to load student details.");
            } finally {
                setLoading(false);
            }
        };

        fetchStudent();
    }, [studentID, auth.token, backendURL]);

    if (loading) return <p className="text-center text-gray-500">Loading student details...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }} 
            className="flex flex-col items-center w-full min-h-screen bg-gray-100 p-6"
        >
            <motion.div 
                className="w-full max-w-4xl bg-white rounded-xl shadow-xl p-8 flex flex-col items-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
            >
                {/* Profile Picture */}
                <motion.img 
                    src={student.picture} 
                    alt={`${student.preferredName || student.firstName} ${student.lastName}`} 
                    className="w-40 h-40 rounded-full border-4 border-gray-300 shadow-md object-cover" 
                    initial={{ scale: 0.8 }} 
                    animate={{ scale: 1 }} 
                    transition={{ duration: 0.5 }}
                />
                <h2 className="text-3xl font-bold mt-3">{student.preferredName || student.firstName} {student.lastName}</h2>
                <p className="text-gray-500">{student.entryStatus}</p>
            </motion.div>

            {/* Student Details Section */}
            <motion.div 
                className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-6 mt-6 flex flex-col sm:flex-row justify-between"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="w-full sm:w-1/2 space-y-3">
                    <div className="flex items-center text-gray-700"><FaUser className="mr-2 text-blue-600" /><span><strong>Age:</strong> {student.age} years</span></div>
                    <div className="flex items-center text-gray-700"><FaEnvelope className="mr-2 text-blue-600" /><span><strong>Email:</strong> {student.email}</span></div>
                    <div className="flex items-center text-gray-700"><FaBuilding className="mr-2 text-blue-600" /><span><strong>Classification:</strong> {student.classification}</span></div>
                    <div className="flex items-center text-gray-700"><FaMapMarkerAlt className="mr-2 text-blue-600" /><span><strong>Building:</strong> {student.building}, Floor {student.floor || "N/A"}</span></div>
                </div>

                <div className="w-full sm:w-1/2 space-y-3">
                    <div className="flex items-center text-gray-700"><FaIdBadge className="mr-2 text-blue-600" /><span><strong>Student Number:</strong> {student.studentNumber}</span></div>
                    <div className="flex items-center text-gray-700"><FaMoneyBill className="mr-2 text-blue-600" /><span><strong>Room Rate:</strong> ${student.roomRate}</span></div>
                    <div className="flex items-center text-gray-700"><FaCalendarAlt className="mr-2 text-blue-600" /><span><strong>Contract:</strong> {new Date(student.contractDates.start).toLocaleDateString()} - {new Date(student.contractDates.end).toLocaleDateString()}</span></div>
                </div>
            </motion.div>

            {/* Associations Section */}
            <motion.div 
                className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-6 mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h3 className="text-lg font-semibold mb-4 text-center">Student Associations</h3>
                <div className="grid grid-cols-3 gap-4">
                    <motion.div className="bg-blue-100 p-4 rounded-lg text-center">
                        <h4 className="text-2xl font-bold text-blue-600">{student.packages?.length || 0}</h4>
                        <p>Packages</p>
                    </motion.div>
                    <motion.div className="bg-yellow-100 p-4 rounded-lg text-center">
                        <h4 className="text-2xl font-bold text-yellow-600">{student.incidentReports?.length || 0}</h4>
                        <p>Incident Reports</p>
                    </motion.div>
                    <motion.div className="bg-green-100 p-4 rounded-lg text-center">
                        <h4 className="text-2xl font-bold text-green-600">{student.studentConnectionNotes?.length || 0}</h4>
                        <p>Student Notes</p>
                    </motion.div>
                </div>
            </motion.div>
        </motion.div>
    );
}