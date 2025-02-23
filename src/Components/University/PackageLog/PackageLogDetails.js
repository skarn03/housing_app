import React from "react";
import { motion } from "framer-motion";
import { FaTimes, FaUser, FaBox, FaCheckCircle, FaTimesCircle, FaBuilding } from "react-icons/fa";

export default function PackageLogDetails({ log, onClose }) {
    // ✅ Group packages by student
    const groupedPackages = log.packages.reduce((acc, pkgEntry) => {
        const studentId = pkgEntry.package.recipient._id;
        if (!acc[studentId]) {
            acc[studentId] = {
                student: pkgEntry.package.recipient,
                packages: [],
            };
        }
        acc[studentId].packages.push(pkgEntry);
        return acc;
    }, {});

    // ✅ Convert object to array and sort students alphabetically by last name
    const sortedStudents = Object.values(groupedPackages).sort((a, b) =>
        a.student.lastName.localeCompare(b.student.lastName)
    );

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4"
        >
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl max-h-[85vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h2 className="text-2xl font-bold text-gray-800">📦 Package Log Details</h2>
                    <button onClick={onClose} className="text-gray-600 hover:text-gray-900 transition">
                        <FaTimes size={22} />
                    </button>
                </div>

                {/* Log Metadata */}
                <div className="mb-6 bg-gray-100 p-4 rounded-lg shadow-sm">
                    <p className="text-lg text-gray-700 font-medium">🧑 Created By: <span className="font-semibold">{log.createdBy.firstName} {log.createdBy.lastName}</span></p>
                    <p className="text-lg text-gray-700 font-medium">🕒 Created At: <span className="font-semibold">{new Date(log.createdAt).toLocaleString()}</span></p>
                </div>

                {/* Buildings */}
                <h4 className="font-semibold text-gray-700 mb-3 text-lg">🏢 Buildings:</h4>
                <div className="flex flex-wrap gap-2 mb-6">
                    {log.buildings.map((building) => (
                        <span key={building._id} className="flex items-center bg-gray-200 px-3 py-1 rounded-lg text-gray-800 shadow-sm">
                            <FaBuilding className="mr-2 text-blue-500" /> {building.name}
                        </span>
                    ))}
                </div>

                {/* Students & Packages */}
                <h4 className="font-semibold text-gray-700 mb-3 text-lg">🎓 Students & Packages:</h4>
                <div className="space-y-6">
                    {sortedStudents.map(({ student, packages }) => (
                        <div key={student._id} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                            {/* Student Info */}
                            <div className="flex items-center gap-4 mb-4">
                                <img
                                    src={student.picture || "https://via.placeholder.com/60"}
                                    alt="Student"
                                    className="w-16 h-16 rounded-full border border-gray-300 shadow-sm"
                                />
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900">{student.lastName}, {student.firstName}</h3>
                                    <p className="text-md text-gray-600"><FaUser className="inline text-blue-500" /> Student ID: {student.studentNumber}</p>
                                </div>
                            </div>

                            {/* Package List */}
                            <div className="border-t pt-3 space-y-3">
                                {packages.map((pkgEntry) => (
                                    <div 
                                        key={pkgEntry.package._id} 
                                        className="p-4 flex items-center justify-between border rounded-md shadow-sm transition hover:bg-gray-50"
                                    >
                                        <div>
                                            <p className="text-lg text-gray-700"><FaBox className="inline text-yellow-500" /> <strong>Tracking #:</strong> {pkgEntry.package.trackingNumber}</p>
                                        </div>
                                        <div className="text-lg">
                                            {pkgEntry.present ? (
                                                <span className="flex items-center gap-2 text-green-600 font-semibold">
                                                    <FaCheckCircle /> Present
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-2 text-red-600 font-semibold">
                                                    <FaTimesCircle /> Missing
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
