import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../Hooks/AuthContext";
import { motion } from "framer-motion";
import { FaUserPlus } from "react-icons/fa";

// 1) Import toast
import { toast } from "react-toastify";

export default function AddStaffForm({ universityData }) {
    const auth = useContext(AuthContext);
    const backendURL =
        process.env.REACT_APP_BACKEND_URL || "http://localhost:8000/api/";

    const [formData, setFormData] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        role: "RA",
        building: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Handle all input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // Perform client-side validations before submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // 1. Check required fields
        if (!formData.firstName.trim()) {
            setError("First Name is required.");
            setLoading(false);
            return;
        }
        if (!formData.lastName.trim()) {
            setError("Last Name is required.");
            setLoading(false);
            return;
        }
        if (!formData.email.trim()) {
            setError("Email is required.");
            setLoading(false);
            return;
        }
        if (!formData.building) {
            setError("You must select a building.");
            setLoading(false);
            return;
        }

        // 2. Check email domain if universityData.domain is provided
        const domain = universityData?.domain?.toLowerCase(); // e.g. "emich.edu"
        if (domain) {
            const emailLower = formData.email.toLowerCase();
            if (!emailLower.endsWith(`@${domain}`)) {
                setError(`Email must end with @${domain}`);
                setLoading(false);
                return;
            }
        }

        // If all validations pass, submit to backend
        try {
            await axios.post(`${backendURL}staff/add`, formData, {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                    "Content-Type": "application/json",
                },
            });

            // 3) If successful, show success toast
            toast.success("Staff added successfully!");

            // Clear form after success (optional)
            setFormData({
                firstName: "",
                middleName: "",
                lastName: "",
                email: "",
                role: "RA",
                building: "",
            });
        } catch (err) {
            // 4) Show error toast
            console.log(err);
            toast.error(err?.response?.data?.message);

            setError("Failed to add staff member.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="px-8 py-8"
        >
            {/* Title */}
            <div className="flex items-center gap-3 mb-6">
                <FaUserPlus className="text-3xl text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-800">
                    Add New Staff Member
                </h2>
            </div>

            {/* Inline error message (optional) */}
            {error && (
                <motion.div
                    className="text-red-500 bg-red-50 border border-red-200 p-3 rounded mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    {error}
                </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* First & Middle Name */}
                <div className="flex flex-col md:flex-row gap-5">
                    <div className="flex-1">
                        <label className="block text-gray-700 font-medium mb-1">
                            First Name
                        </label>
                        <input
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>

                    <div className="flex-1">
                        <label className="block text-gray-700 font-medium mb-1">
                            Middle Name (Optional)
                        </label>
                        <input
                            type="text"
                            name="middleName"
                            placeholder="Middle Name"
                            value={formData.middleName}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                </div>

                {/* Last Name */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">
                        Last Name
                    </label>
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                </div>

                {/* Role */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">
                        Role
                    </label>
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        <option value="RA">RA</option>
                        <option value="GHD">GHD</option>
                        <option value="CD">CD</option>
                        <option value="Admin">Admin</option>
                        <option value="SuperAdmin">SuperAdmin</option>
                        
                    </select>
                </div>

                {/* Building (Single) */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">
                        Building
                    </label>
                    <select
                        name="building"
                        value={formData.building}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    >
                        <option value="" disabled>
                            -- Select a Building --
                        </option>
                        {universityData?.buildings?.map((bldg) => (
                            <option key={bldg._id} value={bldg._id}>
                                {bldg.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white py-3 rounded-md font-semibold hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    {loading ? "Adding..." : "Add Staff"}
                </button>
            </form>
        </motion.div>
    );
}
