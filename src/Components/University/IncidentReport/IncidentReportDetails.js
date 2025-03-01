import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    FaTimes,
    FaExpand,
    FaUser,
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaClock,
    FaCheckCircle,
    FaBuilding,
    FaIdBadge,
    FaInfoCircle,
    FaClipboardList,
} from "react-icons/fa";

export default function IncidentReportDetails({ report, onClose }) {
    const [fullScreenImage, setFullScreenImage] = useState(null);

    useEffect(() => {
        console.log("Incident Report:", report);
    }, [report]);

    return (
        <>
            {/* Full-Screen Image Modal */}
            {fullScreenImage && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="fixed inset-0 bg-black bg-opacity-80 flex flex-col justify-center items-center z-[999] p-4"
                >
                    <motion.div className="relative w-full max-w-4xl">
                        <img
                            src={fullScreenImage}
                            alt="Full Screen"
                            className="max-h-[80vh] w-full object-contain rounded-lg shadow-xl"
                        />
                        <button
                            onClick={() => setFullScreenImage(null)}
                            className="absolute top-4 right-4 text-white hover:text-gray-300 transition"
                        >
                            <FaTimes size={32} />
                        </button>
                    </motion.div>
                    <motion.button
                        onClick={() => setFullScreenImage(null)}
                        className="mt-4 px-6 py-2 bg-white text-gray-800 rounded-lg shadow hover:bg-gray-100 transition"
                        whileHover={{ scale: 1.05 }}
                    >
                        Cancel
                    </motion.button>
                </motion.div>
            )}

            {/* Main Modal */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center p-4 z-40"
            >
                <motion.div
                    className="bg-white rounded-xl shadow-2xl max-w-4xl w-full p-8 relative overflow-y-auto max-h-[90vh]"
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition"
                    >
                        <FaTimes size={28} />
                    </button>

                    {/* Header */}
                    <header className="mb-6 pb-4 border-b border-gray-200">
                        <h2 className="text-3xl font-extrabold text-gray-800 flex items-center gap-2">
                            <FaClipboardList className="text-blue-600" />
                            Incident Report Details
                        </h2>
                        <p className="mt-2 text-sm text-gray-500">
                            Review the complete details for this incident report.
                        </p>
                    </header>

                    <div className="space-y-6">
                        {/* Reporter Details */}
                        <section className="bg-gray-50 rounded-lg p-4 shadow-sm">
                            <h3 className="text-xl font-bold text-gray-700 mb-3 flex items-center gap-2">
                                <FaUser className="text-blue-500" />
                                Reporter Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <p className="text-base flex items-center gap-2">
                                    <FaUser className="text-blue-500" />
                                    <span className="font-semibold text-gray-700">Name:</span>
                                    <span className="text-gray-600">{report.reporter.fullName}</span>
                                </p>
                                <p className="text-base flex items-center gap-2">
                                    <FaIdBadge className="text-green-500" />
                                    <span className="font-semibold text-gray-700">Position:</span>
                                    <span className="text-gray-600">{report.reporter.position}</span>
                                </p>
                                <p className="text-base flex items-center gap-2">
                                    <FaEnvelope className="text-red-500" />
                                    <span className="font-semibold text-gray-700">Email:</span>
                                    <span className="text-gray-600">{report.reporter.email}</span>
                                </p>
                                <p className="text-base flex items-center gap-2">
                                    <FaPhone className="text-yellow-500" />
                                    <span className="font-semibold text-gray-700">Phone:</span>
                                    <span className="text-gray-600">{report.reporter.phoneNumber}</span>
                                </p>
                            </div>
                            <p className="text-base flex items-center gap-2 mt-4">
                                <FaMapMarkerAlt className="text-purple-500" />
                                <span className="font-semibold text-gray-700">Address:</span>
                                <span className="text-gray-600">
                                    {report.reporter.physicalAddress}
                                </span>
                            </p>
                        </section>

                        {/* Incident Information */}
                        <section className="bg-gray-50 rounded-lg p-4 shadow-sm">
                            <h3 className="text-xl font-bold text-gray-700 mb-3 flex items-center gap-2">
                                <FaInfoCircle className="text-blue-500" />
                                Incident Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <p className="text-base flex items-center gap-2">
                                    <FaInfoCircle className="text-blue-500" />
                                    <span className="font-semibold text-gray-700">Nature:</span>
                                    <span className="text-gray-600">{report.nature}</span>
                                </p>
                                <p className="text-base flex items-center gap-2">
                                    <FaCalendarAlt className="text-red-500" />
                                    <span className="font-semibold text-gray-700">Date:</span>
                                    <span className="text-gray-600">
                                        {new Date(report.date).toLocaleDateString()}
                                        {report.time && ` at ${report.time}`}
                                    </span>
                                </p>
                            </div>
                            <p className="text-base flex items-center gap-2 mt-4">
                                <FaMapMarkerAlt className="text-green-500" />
                                <span className="font-semibold text-gray-700">Location:</span>
                                <span className="text-gray-600">{report.location}</span>
                            </p>
                            <p className="text-base flex items-center gap-2 mt-2">
                                <FaMapMarkerAlt className="text-green-500" />
                                <span className="font-semibold text-gray-700">
                                    Specific Location:
                                </span>
                                <span className="text-gray-600">{report.specificLocation}</span>
                            </p>
                            <div className="mt-4">
                                <h4 className="text-lg font-semibold text-gray-700 mb-1 flex items-center gap-2">
                                    <FaInfoCircle className="text-blue-500" />
                                    Description
                                </h4>
                                <p className="text-base text-gray-700 whitespace-pre-wrap break-words">
                                    {report.description}
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <p className="text-base flex items-center gap-2">
                                    <FaCheckCircle className="text-green-600" />
                                    <span className="font-semibold text-gray-700">
                                        Campus Police Response:
                                    </span>
                                    <span className="text-gray-600">
                                        {report.campusPoliceResponse}
                                    </span>
                                </p>
                                <p className="text-base flex items-center gap-2">
                                    <FaClipboardList className="text-blue-600" />
                                    <span className="font-semibold text-gray-700">
                                        Report Number:
                                    </span>
                                    <span className="text-gray-600">{report.reportNumber}</span>
                                </p>
                            </div>
                        </section>

                        {/* Involved Parties */}
                        {report.involvedParties && report.involvedParties.length > 0 && (
                            <section className="bg-gray-50 rounded-lg p-4 shadow-sm">
                                <h3 className="text-xl font-bold text-gray-700 mb-3 flex items-center gap-2">
                                    <FaUser className="text-blue-500" />
                                    Involved Parties
                                </h3>
                                <div className="space-y-4">
                                    {report.involvedParties.map((party, index) => {
                                        // If the 'student' field is populated from the backend, we can show more details:
                                        const studentData = party.student; // This is the populated Student doc, if available
                                        // Fallback to the data stored directly in the party object if needed:
                                        const fallbackName = party.studentName || "";
                                        const fallbackNumber = party.studentNumber || "";
                                        const fallbackBuilding = party.studentBuilding || "";
                                        const fallbackRoom = party.studentRoom || "";
                                        const role = party.role;

                                        // We'll prefer data from 'studentData' if present:
                                        const displayName = studentData
                                            ? `${studentData.firstName} ${studentData.lastName}`
                                            : fallbackName;
                                        const displayNumber = studentData
                                            ? studentData.studentNumber
                                            : fallbackNumber;
                                        const displayBuilding = studentData
                                            ? studentData.building
                                            : fallbackBuilding;
                                        const displayRoom = studentData ? studentData.room : fallbackRoom;
                                        const displayPicture = studentData ? studentData.picture : null;

                                        return (
                                            <div
                                                key={index}
                                                className="p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition"
                                            >
                                                <div className="flex items-center gap-4">
                                                    {/* Student Picture if available */}
                                                    {displayPicture && (
                                                        <img
                                                            src={displayPicture}
                                                            alt={displayName}
                                                            className="w-16 h-16 object-cover rounded-full border shadow-sm"
                                                        />
                                                    )}
                                                    <div>
                                                        {/* Name & Student Number */}
                                                        <p className="text-base flex items-center gap-2">
                                                            <FaUser className="text-blue-500" />
                                                            <span className="font-semibold text-gray-700">
                                                                Student:
                                                            </span>
                                                            <span className="text-gray-600">{displayName}</span>
                                                            <span className="text-sm text-gray-500">
                                                                (#{displayNumber})
                                                            </span>
                                                        </p>
                                                        {/* Role */}
                                                        <p className="text-base flex items-center gap-2 mt-1">
                                                            <FaInfoCircle className="text-green-500" />
                                                            <span className="font-semibold text-gray-700">Role:</span>
                                                            <span className="text-gray-600">{role}</span>
                                                        </p>
                                                        {/* Building & Room */}
                                                        <p className="text-base flex items-center gap-2 mt-1">
                                                            <FaBuilding className="text-purple-500" />
                                                            <span className="font-semibold text-gray-700">
                                                                Building:
                                                            </span>
                                                            <span className="text-gray-600">
                                                                {displayBuilding}
                                                                {displayRoom && ` - Room: ${displayRoom}`}
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        )}

                        {/* Supporting Documents */}
                        {report.supportingDocuments && report.supportingDocuments.length > 0 && (
                            <section className="bg-gray-50 rounded-lg p-4 shadow-sm">
                                <h3 className="text-xl font-bold text-gray-700 mb-3 flex items-center gap-2">
                                    <FaExpand className="text-blue-500" />
                                    Supporting Documents
                                </h3>
                                <div className="flex flex-wrap gap-4">
                                    {report.supportingDocuments.map((doc, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={doc}
                                                alt={`Document ${index + 1}`}
                                                className="w-40 h-40 object-cover rounded-lg border shadow-sm transition-transform transform group-hover:scale-105 cursor-pointer"
                                                onClick={() => setFullScreenImage(doc)}
                                            />
                                            <button
                                                onClick={() => setFullScreenImage(doc)}
                                                className="absolute bottom-2 right-2 bg-white bg-opacity-75 rounded-full p-1 text-gray-600 hover:text-gray-800 transition opacity-0 group-hover:opacity-100"
                                                title="View Fullscreen"
                                            >
                                                <FaExpand size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </>
    );
}
