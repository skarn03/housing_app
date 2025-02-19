import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { AuthContext } from "../../../Hooks/AuthContext";
import { FaEnvelope, FaMapMarkerAlt, FaBuilding, FaCalendarAlt, FaMoneyBill, FaUser,FaIdBadge } from "react-icons/fa";

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
            className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto"
        >
            {/* Profile Picture */}
            <div className="flex flex-col items-center mb-6">
                <motion.img 
                    src={student.picture} 
                    alt={`${student.preferredName || student.firstName} ${student.lastName}`} 
                    className="w-32 h-32 rounded-full border-4 border-gray-300 shadow-md object-cover" 
                    initial={{ scale: 0.8 }} 
                    animate={{ scale: 1 }} 
                    transition={{ duration: 0.5 }}
                />
                <h2 className="text-2xl font-bold mt-3">
                    {student.preferredName || student.firstName} {student.lastName}
                </h2>
                <p className="text-gray-500">{student.entryStatus}</p>
            </div>

            {/* Student Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-3">
                    <div className="flex items-center text-gray-700">
                        <FaUser className="mr-2 text-blue-600" />
                        <span><strong>Age:</strong> {student.age} years</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                        <FaEnvelope className="mr-2 text-blue-600" />
                        <span><strong>Email:</strong> {student.email}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                        <FaBuilding className="mr-2 text-blue-600" />
                        <span><strong>Classification:</strong> {student.classification}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                        <FaMapMarkerAlt className="mr-2 text-blue-600" />
                        <span><strong>Building:</strong> {student.building}, Floor {student.floor || "N/A"}</span>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-3">
                    <div className="flex items-center text-gray-700">
                        <FaIdBadge className="mr-2 text-blue-600" />
                        <span><strong>Student Number:</strong> {student.studentNumber}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                        <FaMoneyBill className="mr-2 text-blue-600" />
                        <span><strong>Room Rate:</strong> ${student.roomRate}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                        <FaCalendarAlt className="mr-2 text-blue-600" />
                        <span>
                            <strong>Contract:</strong> {new Date(student.contractDates.start).toLocaleDateString()} - {new Date(student.contractDates.end).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>

            {/* Associations */}
            <div className="mt-6 p-4 border-t">
                <h3 className="text-lg font-semibold mb-2">Associations</h3>
                <ul className="list-disc pl-6 text-gray-600">
                    <li>Packages: {student.packages.length}</li>
                    <li>Incident Reports: {student.incidentReports.length}</li>
                    <li>Student Connection Notes: {student.studentConnectionNotes.length}</li>
                </ul>
            </div>
        </motion.div>
    );
}
