import React from "react";
import { motion } from "framer-motion";

export default function StudentConnection() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <h2 className="text-2xl font-semibold mb-2">Student Connection</h2>
            <p>Manage student engagement, housing, and academic support.</p>
        </motion.div>
    );
}
