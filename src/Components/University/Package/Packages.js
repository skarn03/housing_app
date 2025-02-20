import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaPlus } from "react-icons/fa";
import AddPackageForm from "./AddPackageForm";

export default function Packages({universityData}) {
    const [showForm, setShowForm] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-6 bg-white rounded-lg shadow-lg"
        >
            {/* Top Bar */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Packages</h2>
                <button 
                    onClick={() => setShowForm(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition"
                >
                    <FaPlus /> Add Package
                </button>
            </div>

            <p>Track and manage incoming packages for students and staff.</p>
            {showForm && <AddPackageForm buildings={universityData.buildings} onClose={() => setShowForm(false)} />}
        </motion.div>
    );
}