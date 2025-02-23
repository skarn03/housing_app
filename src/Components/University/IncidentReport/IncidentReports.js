import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaPlus } from "react-icons/fa";
import AddIncidentReportForm from "./AddIncidentReportForm ";
export default function IncidentReports() {
    const [showForm, setShowForm] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-6 bg-white rounded-lg shadow-lg"
        >
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">🚔 Incident Reports</h2>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-600 transition"
                >
                    <FaPlus /> Add Incident Report
                </button>
            </div>

            <p className="text-gray-600">Review and handle incident reports related to the university.</p>

            {/* Add Incident Report Modal */}
            {showForm && <AddIncidentReportForm onClose={() => setShowForm(false)} />}
        </motion.div>
    );
}
