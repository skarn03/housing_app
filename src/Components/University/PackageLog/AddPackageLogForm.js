import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { AuthContext } from "../../../Hooks/AuthContext";
import { motion } from "framer-motion";
import { FaTimes, FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function AddPackageLogForm({ onClose, universityData }) {
    const auth = useContext(AuthContext);
    const backendURL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000/api/";

    const [packages, setPackages] = useState([]);
    const [groupedPackages, setGroupedPackages] = useState({});
    const [selectedPackages, setSelectedPackages] = useState({});
    const [selectedBuildings, setSelectedBuildings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [expanded, setExpanded] = useState({});
    const [showBuildingDropdown, setShowBuildingDropdown] = useState(false);

    const buildingDropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (buildingDropdownRef.current && !buildingDropdownRef.current.contains(event.target)) {
                setShowBuildingDropdown(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        fetchPackages();
    }, [selectedBuildings]);

    const fetchPackages = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`${backendURL}package/all`, {
                params: { search: "Logged In", buildings: selectedBuildings.join(",") },
                headers: { "Authorization": `Bearer ${auth.token}` }
            });

            const grouped = groupPackagesByStudent(response.data.packages);
            setPackages(response.data.packages);
            setGroupedPackages(grouped);
            setSelectedPackages(response.data.packages.reduce((acc, pkg) => {
                acc[pkg._id] = true; // Default all packages as present
                return acc;
            }, {}));

            // Expand all students by default
            setExpanded(Object.keys(grouped).reduce((acc, studentId) => {
                acc[studentId] = true;
                return acc;
            }, {}));

        } catch (err) {
            console.error("❌ Error fetching packages:", err);
            setError("Failed to load packages.");
        } finally {
            setLoading(false);
        }
    };

    const groupPackagesByStudent = (packages) => {
        return packages.reduce((acc, pkg) => {
            if (!pkg.recipient) return acc; // Ensure recipient exists
            const studentId = pkg.recipient._id;
            if (!acc[studentId]) acc[studentId] = { student: pkg.recipient, packages: [] };
            acc[studentId].packages.push(pkg);
            return acc;
        }, {});
    };
    

    const togglePackageSelection = (packageId) => {
        setSelectedPackages((prev) => ({
            ...prev,
            [packageId]: !prev[packageId]
        }));
    };

    const toggleBuildingSelection = (buildingId) => {
        setSelectedBuildings((prev) =>
            prev.includes(buildingId) ? prev.filter(id => id !== buildingId) : [...prev, buildingId]
        );
    };

    const createPackageLog = async () => {
        const packageIds = Object.keys(selectedPackages);
        const packagePresence = selectedPackages;
    
        if (packageIds.length === 0) {
            alert("Please select at least one package.");
            return;
        }
    
        try {
            await axios.post(`${backendURL}packagelog/create`, {
                packageIds,
                packagePresence,
                buildingIds: selectedBuildings
            }, {
                headers: { "Authorization": `Bearer ${auth.token}` }
            });
    
            alert("✅ Package Log created successfully!");
            onClose();
    
        } catch (error) {
            console.error("❌ Error creating package log:", error);
            alert("Failed to create package log.");
        }
    };
    

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4"
        >
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-5xl h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Create Package Log</h2>
                    <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
                        <FaTimes size={24} />
                    </button>
                </div>

                {/* Building Filter Dropdown */}
                <div className="relative mb-4" ref={buildingDropdownRef}>
                    <button
                        className="border px-4 py-3 w-full rounded-lg flex items-center justify-between bg-gray-100 hover:bg-gray-200 transition"
                        onClick={() => setShowBuildingDropdown((prev) => !prev)}
                    >
                        Select Buildings
                        {showBuildingDropdown ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                    {showBuildingDropdown && (
                        <div className="absolute bg-white border rounded-lg shadow-md mt-2 w-full max-h-60 overflow-y-auto z-10">
                            {universityData.buildings.map((building) => (
                                <label key={building._id} className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                    <span>{building.name}</span>
                                    <input
                                        type="checkbox"
                                        checked={selectedBuildings.includes(building._id)}
                                        onChange={() => toggleBuildingSelection(building._id)}
                                    />
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* Package List */}
                <div className="flex-1 overflow-y-auto border p-3 rounded-lg bg-gray-50">
                    {loading ? (
                        <p className="text-center text-gray-500">Loading packages...</p>
                    ) : error ? (
                        <p className="text-center text-red-500">{error}</p>
                    ) : (
                        Object.values(groupedPackages).map(({ student, packages }) => (
                            <div key={student._id} className="mb-4 bg-white p-4 rounded-lg shadow-md">
                                {/* Student Info */}
                                <div className="flex items-center gap-4 mb-3">
                                    <img
                                        src={student.picture || "https://via.placeholder.com/50"}
                                        alt="Student"
                                        className="w-14 h-14 rounded-full border"
                                    />
                                    <div>
                                        <h3 className="text-lg font-semibold">{student.firstName} {student.lastName}</h3>
                                        <p className="text-sm text-gray-600">Student ID: {student.studentNumber}</p>
                                    </div>
                                </div>

                                {/* Package List for Student */}
                                <div className="border-t pt-3">
                                    {packages.map((pkg) => (
                                        <label key={pkg._id} className="flex items-center justify-between px-4 py-2 border-b last:border-b-0 cursor-pointer hover:bg-gray-100">
                                            <div>
                                                <p className="text-gray-800"><strong>Tracking #:</strong> {pkg.trackingNumber}</p>
                                                <p className="text-gray-600 text-sm">{pkg.parcelType}</p>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={selectedPackages[pkg._id]}
                                                onChange={() => togglePackageSelection(pkg._id)}
                                                className="w-6 h-6 accent-blue-500 cursor-pointer"
                                            />
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 mt-5">
                    <button onClick={onClose} className="bg-gray-500 text-white px-5 py-2 rounded-lg hover:bg-gray-600 transition">Cancel</button>
                    <button onClick={createPackageLog} className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">Confirm</button>
                </div>
            </div>
        </motion.div>
    );
}
