import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
    FaPlus, FaChevronDown, FaChevronUp, FaEye, FaBuilding, FaUser,
    FaClock, FaCalendarAlt, FaBoxOpen, FaCheckCircle, FaTimesCircle, FaArrowLeft, FaArrowRight
} from "react-icons/fa";
import AddPackageLogForm from "./AddPackageLogForm";
import PackageLogDetails from "./PackageLogDetails";
import { AuthContext } from "../../../Hooks/AuthContext";

export default function PackageLog({ universityData }) {
    const auth = useContext(AuthContext);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showForm, setShowForm] = useState(false);
    const [packageLogs, setPackageLogs] = useState([]);
    const [expandedLogs, setExpandedLogs] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedLog, setSelectedLog] = useState(null);
    const [searchStaff, setSearchStaff] = useState("");
    const [selectedBuildings, setSelectedBuildings] = useState([]);
    const [showBuildingDropdown, setShowBuildingDropdown] = useState(false);
    const backendURL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000/api/";
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
        fetchPackageLogs();
    }, [searchStaff, selectedBuildings]);

    const fetchPackageLogs = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`${backendURL}packagelog/all`, {
                params: {
                    staff: searchStaff,
                    buildings: selectedBuildings.join(","),
                    page,
                    limit: 20 // ✅ 20 logs per page
                },
                headers: { "Authorization": `Bearer ${auth.token}` }
            });

            setPackageLogs(response.data.logs);
            setTotalPages(response.data.totalPages);
        } catch (err) {
            console.error("❌ Error fetching package logs:", err);
            setError("Failed to load package logs.");
        } finally {
            setLoading(false);
        }
    };

    const toggleExpand = (logId) => {
        setExpandedLogs((prev) => ({
            ...prev,
            [logId]: !prev[logId],
        }));
    };

    const toggleBuildingSelection = (buildingId) => {
        setSelectedBuildings((prev) =>
            prev.includes(buildingId) ? prev.filter(id => id !== buildingId) : [...prev, buildingId]
        );
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg">
            {/* Filters - Responsive */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-6">
                <h2 className="text-2xl font-semibold">📦 Package Logs</h2>

                {/* Staff Filter */}
                <input
                    type="text"
                    placeholder="Search by Staff Name..."
                    value={searchStaff}
                    onChange={(e) => setSearchStaff(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* Building Filter Dropdown */}
                <div className="relative" ref={buildingDropdownRef}>
                    <button
                        className="w-full border px-4 py-2 rounded-lg flex items-center justify-between bg-gray-100 hover:bg-gray-200 transition"
                        onClick={() => setShowBuildingDropdown((prev) => !prev)}
                    >
                        Filter by Building
                        {showBuildingDropdown ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                    {showBuildingDropdown && (
                        <div className="absolute bg-white border rounded-lg shadow-md mt-2 w-full max-h-60 overflow-y-auto z-10">
                            {universityData.buildings.map((building) => (
                                <label key={building._id} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedBuildings.includes(building._id)}
                                        onChange={() => toggleBuildingSelection(building._id)}
                                    />
                                    {building.name}
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <button
                onClick={() => setShowForm(true)}
                className="w-full md:w-auto bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition"
            >
                <FaPlus /> Create Package Log
            </button>

            {/* AddPackageLogForm Modal */}
            {showForm && <AddPackageLogForm universityData={universityData} onClose={() => setShowForm(false)} />}

            {loading ? (
                <p className="text-center text-gray-500 mt-4">Loading package logs...</p>
            ) : error ? (
                <p className="text-center text-red-500 mt-4">{error}</p>
            ) : packageLogs.length === 0 ? (
                <p className="text-center text-gray-500 mt-4">No package logs found.</p>
            ) : (
                <div className="space-y-4 mt-4">
                    {packageLogs.map((log) => {
                        const totalPackages = log.packages.length;
                        const loggedOutCount = log.packages.filter(pkg => !pkg.present).length;
                        const presentCount = totalPackages - loggedOutCount;

                        return (
                            <motion.div
                                key={log._id}
                                className="bg-white rounded-lg p-6 shadow-md border border-gray-200"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {/* Log Info - Cleaner Layout */}
                                <div className="flex flex-col sm:flex-row justify-between">
                                    <div>
                                        <p className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                                            <FaUser className="text-blue-500" /> {log.createdBy.firstName} {log.createdBy.lastName}
                                        </p>
                                        <p className=" text-gray-600 flex items-center gap-2 mt-1 text-lg">
                                            <FaCalendarAlt className="text-red-500" /> {new Date(log.createdAt).toLocaleDateString()}
                                            <FaClock className="text-gray-600 ml-3 " /> {new Date(log.createdAt).toLocaleTimeString()}
                                        </p>
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {log.buildings.map((building) => (
                                                <span key={building._id} className="flex items-center bg-gray-200 px-3 py-1 rounded-lg text-gray-800 shadow-sm">
                                                    <FaBuilding className="mr-2 text-blue-500" /> {building.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 mt-3 sm:mt-0">
                                        <p className="text-lg text-gray-700"><FaBoxOpen className="inline text-yellow-500" /> Total Packages: <strong>{totalPackages}</strong></p>
                                        <p className="text-lg text-green-600"><FaCheckCircle className="inline" /> Present: <strong>{presentCount}</strong></p>
                                        <p className="text-lg text-red-600"><FaTimesCircle className="inline" /> Missing: <strong>{loggedOutCount}</strong></p>
                                    </div>
                                    
                                </div>
                                {/* View More Button */}
                                <button
                                    onClick={() => setSelectedLog(log)}
                                    className="mt-5  bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition"
                                >
                                    <FaEye /> View More
                                </button>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Full Package Log Details Modal */}
            {selectedLog && <PackageLogDetails log={selectedLog} onClose={() => setSelectedLog(null)} />}
            <div className="flex justify-center items-center gap-4 mt-6">
                <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-4 py-2 bg-gray-300 rounded-lg flex items-center gap-2 disabled:opacity-50">
                    <FaArrowLeft /> Prev
                </button>
                <span>Page {page} of {totalPages}</span>
                <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="px-4 py-2 bg-gray-300 rounded-lg flex items-center gap-2 disabled:opacity-50">
                    Next <FaArrowRight />
                </button>
            </div>
        </div>

    );
}
