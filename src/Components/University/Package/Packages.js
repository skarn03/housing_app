import React, { useState, useEffect, useContext, useRef } from "react";
import { motion } from "framer-motion";
import { FaPlus, FaSearch, FaChevronDown, FaChevronUp, FaFilter, FaArrowRight, FaArrowLeft, FaSignOutAlt } from "react-icons/fa";
import axios from "axios";
import { AuthContext } from "../../../Hooks/AuthContext";
import AddPackageForm from "./AddPackageForm";

export default function Packages({ universityData }) {
    const auth = useContext(AuthContext);
    const backendURL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000/api/";

    const [showForm, setShowForm] = useState(false);
    const [packages, setPackages] = useState([]);
    const [groupedPackages, setGroupedPackages] = useState({});
    const [expanded, setExpanded] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedBuildings, setSelectedBuildings] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState("Logged In"); // Status Filter
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Student Search & Selection
    const [searchStudent, setSearchStudent] = useState("");
    const [studentResults, setStudentResults] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [debouncedSearchStudent, setDebouncedSearchStudent] = useState("");
    const studentDropdownRef = useRef(null);

    const [showBuildingDropdown, setShowBuildingDropdown] = useState(false);
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const buildingDropdownRef = useRef(null);
    const statusDropdownRef = useRef(null);
    const [selectedPackages, setSelectedPackages] = useState([]);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    useEffect(() => {
        function handleClickOutside(event) {
            if (buildingDropdownRef.current && !buildingDropdownRef.current.contains(event.target)) {
                setShowBuildingDropdown(false);
            }
            if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)) {
                setShowStatusDropdown(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        fetchPackages();
    }, [searchTerm, selectedBuildings, selectedStatus, selectedStudent, page]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchStudent(searchStudent);
        }, 1500);
        return () => clearTimeout(timer);
    }, [searchStudent]);

    useEffect(() => {
        if (!universityData || !auth.token || debouncedSearchStudent.trim() === "") return;
        axios
            .get(`${backendURL}student/getStudents`, {
                params: {
                    universityId: universityData._id,
                    search: debouncedSearchStudent,
                    page: 1,
                    limit: 10,
                },
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                    "Content-Type": "application/json",
                },
            })
            .then((response) => {
                setStudentResults(response.data.students);
            })
            .catch((err) => {
                console.error("❌ Error fetching students:", err);
            });
    }, [debouncedSearchStudent, auth.token, backendURL, universityData]);

    const handleStudentSelect = (student) => {
        setSelectedStudent({
            student: student._id,
            studentName: `${student.firstName} ${student.lastName}`,
            studentNumber: student.studentNumber,
        });
        setSearchStudent("");
        setStudentResults([]);
    };

    const fetchPackages = async () => {
        setLoading(true);
        setError(null);

        try {
            console.log("📦 Fetching packages...");

            let searchQuery = searchTerm;
            if (selectedStatus) {
                searchQuery = searchQuery ? `${searchQuery},${selectedStatus}` : selectedStatus;
            }

            const response = await axios.get(`${backendURL}package/all`, {
                params: {
                    search: searchQuery,
                    buildings: selectedBuildings.join(","),
                    studentId: selectedStudent ? selectedStudent.student : "", // Send student ID to backend
                    page,
                    limit: 40
                },
                headers: { "Authorization": `Bearer ${auth.token}` }
            });

            setPackages(response.data.packages);
            setGroupedPackages(groupPackagesByRecipient(response.data.packages));
            setTotalPages(response.data.totalPages);
            console.log("✅ Packages fetched:", response.data.packages);
        } catch (err) {
            console.error("❌ Error fetching packages:", err);
            setError("Failed to load packages.");
        } finally {
            setLoading(false);
        }
    };

    const groupPackagesByRecipient = (packages) => {
        return packages.reduce((acc, pkg) => {
            const key = pkg.recipient.studentNumber;
            if (!acc[key]) acc[key] = [];
            acc[key].push(pkg);
            return acc;
        }, {});
    };

    const toggleExpand = (studentNumber) => {
        setExpanded((prev) => ({ ...prev, [studentNumber]: !prev[studentNumber] }));
    };

    const toggleBuildingSelection = (buildingId) => {
        setSelectedBuildings((prev) =>
            prev.includes(buildingId) ? prev.filter(id => id !== buildingId) : [...prev, buildingId]
        );
    };

    const toggleStatusSelection = (status) => {
        setSelectedStatus(status === selectedStatus ? "" : status);
    };

    const togglePackageSelection = (packageId) => {
        setSelectedPackages((prev) =>
            prev.includes(packageId) ? prev.filter(id => id !== packageId) : [...prev, packageId]
        );
    };

    const openConfirmModal = () => {
        if (selectedPackages.length === 0) return;
        setShowConfirmModal(true);
    };

    const closeConfirmModal = () => {
        setShowConfirmModal(false);
    };

    const logOutSelectedPackages = async () => {
        try {
            console.log("🔄 Logging out selected packages:", selectedPackages);
            await axios.patch(`${backendURL}package/logout`,
                { packageIds: selectedPackages },
                { headers: { "Authorization": `Bearer ${auth.token}` } }
            );

            setShowConfirmModal(false);
            fetchPackages();
            setSelectedPackages([]);
        } catch (error) {
            console.error("❌ Error logging out packages:", error);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-6 bg-white rounded-lg shadow-lg"
        >
            {/* Top Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
                {/* Search Input */}
                {/* <div className="relative w-full md:w-1/2">
                    <input
                        type="text"
                        placeholder="Search (comma-separated)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <FaSearch className="absolute right-3 top-3 text-gray-500" />
                </div> */}
                {/* Student Search Input */}
                <div className="relative w-full md:w-1/2 mb-4">
                    {selectedStudent ? (
                        <div className="flex items-center gap-2 border p-2 rounded">
                            <span className="font-semibold">{selectedStudent.studentName}</span>
                            <span className="text-sm text-gray-500">({selectedStudent.studentNumber})</span>
                            <button
                                type="button"
                                onClick={() => setSelectedStudent(null)}
                                className="text-blue-500 hover:underline ml-auto"
                            >
                                Clear
                            </button>
                        </div>
                    ) : (
                        <>
                            <input
                                type="text"
                                placeholder="Search by Student..."
                                value={searchStudent}
                                onChange={(e) => setSearchStudent(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg"
                            />
                            {studentResults.length > 0 && (
                                <ul className="absolute z-10 w-full bg-white border rounded mt-1 max-h-60 overflow-y-auto shadow-lg">
                                    {studentResults.map((student) => (
                                        <li
                                            key={student._id}
                                            onClick={() => handleStudentSelect(student)}
                                            className="flex items-center gap-3 p-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                                        >
                                            {/* Student Image */}
                                            <img
                                                src={student.picture || "https://via.placeholder.com/50"}
                                                alt="Student"
                                                className="w-12 h-12 rounded-full border shadow-sm"
                                            />

                                            {/* Student Details */}
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-gray-800">
                                                    {student.firstName} {student.lastName}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    🎓 {student.studentNumber}
                                                </span>
                                                <span className="text-sm text-gray-600">
                                                    🏢 {student.building} | Room {student.room || "N/A"}
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </>
                    )}
                </div>
                <div className=" flex space-x-2 flex-row  ">
                    {/* Multi-Select Building Filter */}
                    <div className="relative" ref={buildingDropdownRef}>
                        <button
                            className="border px-4 py-2 rounded-lg flex items-center gap-2 bg-gray-100 hover:bg-gray-200 transition"
                            onClick={() => setShowBuildingDropdown((prev) => !prev)}
                        >
                            Filter by Building
                            {showBuildingDropdown ? <FaChevronUp /> : <FaChevronDown />}
                        </button>
                        {showBuildingDropdown && (
                            <div className="absolute bg-white border rounded-lg shadow-md mt-2 w-64 max-h-60 overflow-y-auto z-10">
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

                    {/* Status Filter */}
                    <div className="relative" ref={statusDropdownRef}>
                        <button
                            className="border px-4 py-2 rounded-lg flex items-center gap-2 bg-gray-100 hover:bg-gray-200 transition"
                            onClick={() => setShowStatusDropdown((prev) => !prev)}
                        >
                            Filter by Status
                            {showStatusDropdown ? <FaChevronUp /> : <FaChevronDown />}
                        </button>
                        {showStatusDropdown && (
                            <div className="absolute bg-white border rounded-lg shadow-md mt-2 w-40 z-10">
                                {["Logged In", "Logged Out", "Lost"].map((status) => (
                                    <p
                                        key={status}
                                        className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${selectedStatus === status ? "font-bold" : ""}`}
                                        onClick={() => toggleStatusSelection(status)}
                                    >
                                        {status}
                                    </p>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition"
                >
                    <FaPlus /> Add Package
                </button>
            </div>

            {showForm && <AddPackageForm buildings={universityData.buildings} onClose={() => setShowForm(false)} />}



            {loading ? (
                <p className="text-center text-gray-500">Loading packages...</p>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : (
                <div className="space-y-4">
                    {Object.keys(groupedPackages).length === 0 ? (
                        <p className="text-center text-gray-500">No packages found.</p>
                    ) : (
                        Object.entries(groupedPackages).map(([studentNumber, packages]) => {
                            const student = packages[0].recipient;
                            return (
                                <motion.div key={studentNumber} className="bg-gray-100 rounded-lg p-4 shadow-md">
                                    {/* Student Header */}
                                    <div
                                        className="flex items-center justify-between cursor-pointer"
                                        onClick={() => toggleExpand(studentNumber)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={student.picture || "https://via.placeholder.com/50"}
                                                alt="Recipient"
                                                className="w-12 h-12 rounded-full border"
                                            />
                                            <div>
                                                <h3 className="text-lg font-semibold">{student.firstName} {student.lastName}</h3>
                                                <p className="text-sm text-gray-600">Student ID: {student.studentNumber}</p>
                                                <p className="text-sm text-gray-600">Building: {student.building}, Room {student.room || "N/A"}</p>
                                            </div>
                                        </div>
                                        <button>
                                            {expanded[studentNumber] ? <FaChevronUp /> : <FaChevronDown />}
                                        </button>
                                    </div>

                                    {/* Packages List */}
                                    {expanded[studentNumber] && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            transition={{ duration: 0.3 }}
                                            className="mt-3 space-y-3"
                                        >
                                            {packages.map((pkg) => (
                                                <div key={pkg._id} className="bg-white rounded-lg p-3 shadow-sm">
                                                    <div className="flex flex-row justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                                                        {/* Left Section - Package Details */}
                                                        <div className="flex-1">
                                                            <p><strong>Tracking #:</strong> {pkg.trackingNumber || "N/A"}</p>
                                                            <p><strong>Parcel Type:</strong> {pkg.parcelType}</p>
                                                            <p><strong>Shipping Type:</strong> {pkg.shippingType}</p>
                                                            <p><strong>Received By:</strong> {pkg.staff.firstName} {pkg.staff.lastName}</p>
                                                            <p><strong>Status:</strong> {pkg.status}</p>
                                                        </div>

                                                        {/* Right Section - Checkbox */}
                                                        <div>
                                                            <label className="flex items-center space-x-2 cursor-pointer select-none">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedPackages.includes(pkg._id)}
                                                                    onChange={() => togglePackageSelection(pkg._id)}
                                                                    className="hidden peer"
                                                                />
                                                                <div className="w-6 h-6 flex items-center justify-center border-2 border-gray-400 rounded-lg peer-checked:bg-blue-500 peer-checked:border-blue-500 transition-all duration-300">
                                                                    {selectedPackages.includes(pkg._id) && (
                                                                        <svg
                                                                            className="w-4 h-4 text-white"
                                                                            fill="none"
                                                                            stroke="currentColor"
                                                                            viewBox="0 0 24 24"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                        >
                                                                            <path
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                strokeWidth="3"
                                                                                d="M5 13l4 4L19 7"
                                                                            />
                                                                        </svg>
                                                                    )}
                                                                </div>
                                                            </label>
                                                        </div>
                                                    </div>

                                                </div>
                                            ))}
                                        </motion.div>

                                    )}

                                </motion.div>
                            );
                        })
                    )}
                </div>
            )}
            <button onClick={openConfirmModal}
                className="bg-red-500 text-white px-4 py-2 mt-6 rounded-lg flex items-center gap-2 hover:bg-red-600 transition disabled:opacity-50"
                disabled={selectedPackages.length === 0}>
                <FaSignOutAlt /> Log Out Selected
            </button>
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
                    <div className="bg-white p-4 rounded-lg shadow-2xl w-full max-w-lg">
                        {/* Title */}
                        <h2 className="text-2xl font-bold text-center text-red-600 mb-4">Confirm Package Log Out</h2>
                        <p className="text-gray-700 text-center mb-4">Are you sure you want to log out the following packages?</p>

                        {/* Package List */}
                        <div className="max-h-90 overflow-y-auto border border-gray-300 rounded-lg bg-gray-50 p-0 space-y-2">
                            {packages
                                .filter(pkg => selectedPackages.includes(pkg._id))
                                .map(pkg => (
                                    <div key={pkg._id} className="p-4 bg-white rounded-lg border-gray-700 shadow-sm border ">
                                        {/* Student Info */}
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={pkg.recipient.picture || "https://via.placeholder.com/50"}
                                                alt="Student"
                                                className="w-12 h-12 rounded-full border"
                                            />
                                            <div>
                                                <h3 className="text-lg font-semibold">{pkg.recipient.firstName} {pkg.recipient.lastName}</h3>
                                                <p className="text-sm text-gray-500">Student ID: {pkg.recipient.studentNumber}</p>
                                            </div>
                                        </div>

                                        {/* Package Info */}
                                        <div className="mt-3 border-t pt-3 text-gray-700">
                                            <p><strong>📦 Tracking #:</strong> {pkg.trackingNumber}</p>
                                            <p><strong>📦 Parcel Type:</strong> {pkg.parcelType}</p>
                                        </div>
                                    </div>
                                ))}
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-between mt-6">
                            <button
                                onClick={closeConfirmModal}
                                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition w-full mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={logOutSelectedPackages}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition w-full ml-2"
                            >
                                Confirm Log Out
                            </button>
                        </div>
                    </div>
                </div>
            )}


            <div className="flex justify-center items-center gap-4 mt-4">
                <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-4 py-2 bg-gray-200 rounded-lg flex items-center gap-2 disabled:opacity-50">
                    <FaArrowLeft /> Prev Page
                </button>
                <span>Page {page} of {totalPages}</span>
                <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="px-4 py-2 bg-gray-200 rounded-lg flex items-center gap-2 disabled:opacity-50">
                    Next Page <FaArrowRight />
                </button>
            </div>
        </motion.div>



    );
}
