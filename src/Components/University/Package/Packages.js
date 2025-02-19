import React from "react";
import { motion } from "framer-motion";

export default function Packages() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <h2 className="text-2xl font-semibold mb-2">Packages</h2>
            <p>Track and manage incoming packages for students and staff.</p>
        </motion.div>
    );
}
