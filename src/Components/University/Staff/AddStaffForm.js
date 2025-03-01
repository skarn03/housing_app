// AddStaffForm.jsx
import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../Hooks/AuthContext";
import { motion } from "framer-motion";
import { FaUserPlus } from "react-icons/fa";

export default function AddStaffForm() {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const backendURL =
        process.env.REACT_APP_BACKEND_URL || "http://localhost:8000/api/";

    const [formData, setFormData] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        password: "",
        role: "RA",
        building: "",
        university: "",
        revoke: false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await axios.post(`${backendURL}staff/add`, formData, {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                    "Content-Type": "application/json",
                },
            });
            navigate("/staff");
        } catch (err) {
            setError("Failed to add staff member.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            // Additional motion if you like
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

            {error && (
                <motion.div
                    className="text-red-500 bg-red-50 border border-red-200 p-3 rounded mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    {error}
                </motion.div>
            )}

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
                            required
                            className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                        required
                        className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                {/* Password */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">
                        Password
                    </label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                {/* Role */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Role</label>
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        <option value="RA">RA</option>
                        <option value="GHD">GHD</option>
                        <option value="CD">CD</option>
                        <option value="SuperAdmin">SuperAdmin</option>
                    </select>
                </div>

                {/* Building & University */}
                <div className="flex flex-col md:flex-row gap-5">
                    <div className="flex-1">
                        <label className="block text-gray-700 font-medium mb-1">
                            Building ID (Optional)
                        </label>
                        <input
                            type="text"
                            name="building"
                            placeholder="Building ID"
                            value={formData.building}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div className="flex-1">
                        <label className="block text-gray-700 font-medium mb-1">
                            University ID
                        </label>
                        <input
                            type="text"
                            name="university"
                            placeholder="University ID"
                            value={formData.university}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                </div>

                {/* Revoke */}
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        name="revoke"
                        checked={formData.revoke}
                        onChange={handleChange}
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="text-gray-700 font-medium">
                        Revoke Access
                    </label>
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
