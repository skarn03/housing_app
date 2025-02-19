import React from "react";
import { motion } from "framer-motion";

export default function IncidentReports() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <h2 className="text-2xl font-semibold mb-2">Incident Reports</h2>
            <p>Review and handle incident reports related to the university.</p>
        </motion.div>
    );
}
