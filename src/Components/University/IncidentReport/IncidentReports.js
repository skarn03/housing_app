import React, { useState, useEffect, useRef, useContext } from "react";
import { motion } from "framer-motion";
import {
    FaPlus, FaChevronDown, FaChevronUp, FaEye, FaUser, FaCalendarAlt,
    FaClock, FaArrowLeft, FaArrowRight
} from "react-icons/fa";
import axios from "axios";
import AddIncidentReportForm from "./AddIncidentReportForm";
import IncidentReportDetails from "./IncidentReportDetails"; // Assume you have this component
import { AuthContext } from "../../../Hooks/AuthContext";

export default function IncidentReports({ universityData }) {
    const auth = useContext(AuthContext);
    const backendURL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000/api/";

    // States for filters
    const [searchStaff, setSearchStaff] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("");
    const [searchReportNumber, setSearchReportNumber] = useState("");

    // For student filter (searchable)
    const [searchStudent, setSearchStudent] = useState("");
    const [studentResults, setStudentResults] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [loadingStudents, setLoadingStudents] = useState(false);
    const studentDropdownRef = useRef(null);

    // Incident reports and pagination
    const [incidentReports, setIncidentReports] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Modals for Add and View Details
    const [showForm, setShowForm] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);

    // List of location options (same as in the form)
    const LOCATION_OPTIONS = [
        "601 W Forest",
        "611 W Cross Lot",
        "611 W Cross-Psychology Clinic",
        "Academic Buildings",
        "Academic Dishonesty- No Building",
        "Administrative Buildings",
        "Administrative Offices",
        "Alexander Music Building",
        "Alexander Pay Lot",
        "Ann Street",
        "Anne Street Lot",
        "Apartments Parking",
        "Athletic Facilities",
        "Best Hall",
        "Best-Outside",
        "Boone Hall",
        "Bowen Field House",
        "Bowen Lot",
        "Bowman-Roosevelt Lot",
        "Briggs Hall",
        "Brown Apartments",
        "Brown-Outside",
        "Buell Hall",
        "Buell-Outside",
        "Central HRL Office",
        "Central Receiving",
        "Chippewa Club",
        "College of Business Structure",
        "College Place",
        "Common Ground Cafe @ Marshall Hall",
        "Convocation Center",
        "Cornell Court",
        "Cornell Courts Apartments",
        "Cornell Street",
        "Corporate Education Center",
        "Cross Street",
        "Department of Public Safety Office",
        "Dining Facilities",
        "Dining Services Office",
        "Downing Hall",
        "Downing-Outside",
        "E Circle Drive",
        "Eagle Crest Golf Club",
        "Eagles Cafe @ Alexander Music Building",
        "Eagles Cafe @ College of Business-remove",
        "Eagles Cafe @ Halle Library",
        "Eagles Cafe @ Mark Jefferson",
        "Eagles Cafe @ McKenny Hall",
        "Eagles Cafe @ Pray Harrold",
        "Eastbrook",
        "Eastern Eateries",
        "Failure to Comply-No Building",
        "Fletcher Lot",
        "Fletcher School",
        "Food for Thought @ Sill Hall",
        "Ford Hall",
        "Ford Lake",
        "Ford Lot A",
        "Ford Lot B",
        "Ford Reserved Lot",
        "Geddes Town Hall School House",
        "Green Lot 1",
        "Halle Library",
        "Hewitt",
        "Hill-Outside",
        "Hover Building",
        "Hoyt Hall",
        "Hoyt Lot",
        "Hoyt-Outside",
        "Huron River Drive",
        "Indoor Practice Facility",
        "Indoor Practice Facility Lot",
        "Jones Goddard",
        "Jones Pool",
        "Key Bank Lot",
        "King Hall",
        "Lake House",
        "Lakeview Hall",
        "Lowell",
        "Mark Jefferson Lot",
        "Mark Jefferson Science Building",
        "Market Place",
        "Marshall Building",
        "Mayhew",
        "Mayhew Lot 1",
        "Mayhew Lot 2",
        "McKenny Hall",
        "McKenny Staff Lot",
        "McKinney Pay Lot",
        "Munson Apartments",
        "Normal Reserved Lot",
        "Normal Street Lot",
        "North Campus Lot 1",
        "North Campus Lot 2",
        "Oakwood",
        "Oakwood Lot North",
        "Oakwood Lot South",
        "Oakwood Meters",
        "Oakwood Pay Lot",
        "Oestrike Stadium",
        "Off campus",
        "Olds-Marshall Track",
        "Olds-Robb Student Recreation Center",
        "Outside of a Building",
        "Owen Building-College of Business",
        "Parking Facilities",
        "Parking Structure",
        "Pease Auditorium",
        "Pease Lot",
        "Pease Pay Lot",
        "Perrin",
        "Phelps Hall",
        "Phelps-Outside",
        "Physical Plant Parking",
        "Pierce Hall",
        "Pittman Hall",
        "Pittman-Outside",
        "Porter Building",
        "Porter Park",
        "Pray-Harrold Classroom Building",
        "Pray-Harrold Metered Parking",
        "Putnam Hall",
        "Putnam-Outside",
        "Quirk Dramatic Arts Building/Theatre",
        "Rackham Building",
        "Residence Hall Metered Parking",
        "Return from Suspension",
        "Roosevelt Hall",
        "Rynearson Lot",
        "Rynearson Stadium",
        "Saint John",
        "Scicluna Field (Soccer Fields)",
        "Sculpture Studio",
        "Sellers Hall",
        "Sellers-Outside",
        "Sherzer Hall",
        "Sill Hall",
        "Sill Lot",
        "Smith Reserved Lot",
        "Snow Health Center-REMOVE, add Judy Sturgis Hill",
        "Snow Lot",
        "Softball Complex",
        "Sponberg Theatre",
        "Starbucks-Student Center",
        "Starkweather Hall",
        "Strong Physical Science Building",
        "Student Center",
        "Student Center Pay Lot",
        "Tennis Courts",
        "Terrestrial and Aquatics Research Facility",
        "The Commons",
        "The Village",
        "The Village-Outside",
        "University House",
        "University Housing Office-remove",
        "University Park",
        "Unknown",
        "Varsity Field",
        "via Electronic means",
        "W Circle Drive",
        "Walton Hall",
        "Walton-Outside",
        "Warner Gymnasium",
        "Washington Street Lot",
        "Washtenaw Avenue",
        "Welch Hall",
        "West Forest",
        "Westview",
        "Westview Hall",
        "Wise Hall",
        "Wise-Outside",
        "Women's Softball Field"
    ];

    const [debouncedSearchStaff, setDebouncedSearchStaff] = useState(searchStaff);



    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchStaff(searchStaff);
        }, 1500);
        return () => clearTimeout(timer);
    }, [searchStaff]);

    useEffect(() => {
        const fetchIncidentReports = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`${backendURL}incidentreport/all`, {
                    params: {
                        staff: debouncedSearchStaff, // use debounced staff name
                        location: selectedLocation,
                        student: selectedStudent ? selectedStudent.student : searchStudent,
                        reportNumber: searchReportNumber,
                        page,
                        limit: 20,
                    },
                    headers: { Authorization: `Bearer ${auth.token}` },
                });
                setIncidentReports(response.data.logs);
                setTotalPages(response.data.totalPages);
            } catch (err) {
                console.error("❌ Error fetching incident reports:", err);
                setError("Failed to load incident reports.");
            } finally {
                setLoading(false);
            }
        };

        fetchIncidentReports();
    }, [debouncedSearchStaff, selectedLocation, selectedStudent, searchReportNumber, page, auth.token, backendURL]);
    // Fetch students for student filter
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!universityData || !auth.token || searchStudent.trim() === "") return;
            setLoading(true);
            axios
                .get(`${backendURL}student/getStudents`, {
                    params: {
                        universityId: universityData._id,
                        search: searchStudent,
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
                })
                .finally(() => {
                    setLoading(false);
                });
        }, 1500);

        return () => clearTimeout(timer);
    }, [universityData, searchStudent, auth.token, backendURL]);


    const handleStudentSelect = (student) => {
        setSelectedStudent({
            student: student._id,
            studentName: `${student.firstName} ${student.lastName}`,
            studentNumber: student.studentNumber,
        });
        setSearchStudent("");
        setStudentResults([]);
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">🚔 Incident Reports</h2>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-600 transition"
                >
                    <FaPlus /> Add Incident Report
                </button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                {/* Staff Filter */}
                <input
                    type="text"
                    placeholder="Search by Staff Name..."
                    value={searchStaff}
                    onChange={(e) => setSearchStaff(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                />
                {/* Location Filter */}
                <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                >
                    <option value="">All Locations</option>
                    {LOCATION_OPTIONS.map((loc, index) => (
                        <option key={index} value={loc}>
                            {loc}
                        </option>
                    ))}
                </select>
                {/* Report Number Filter */}
                <input
                    type="text"
                    placeholder="Search by Report Number..."
                    value={searchReportNumber}
                    onChange={(e) => setSearchReportNumber(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                />
                {/* Student Filter */}
                <div className="relative">
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
                                <ul className="absolute z-10 w-full bg-white border rounded mt-1 max-h-60 overflow-y-auto">
                                    {studentResults.map((student) => (
                                        <li
                                            key={student._id}
                                            onClick={() => handleStudentSelect(student)}
                                            className="p-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            {student.firstName} {student.lastName} ({student.studentNumber})
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </>
                    )}
                </div>
                {/* Placeholder for consistent grid */}
                <div></div>
            </div>

            {loading ? (
                <p className="text-center text-gray-500">Loading incident reports...</p>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : incidentReports.length === 0 ? (
                <p className="text-center text-gray-500">No incident reports found.</p>
            ) : (
                <div className="grid gap-6">
                    {incidentReports.map((report) => (
                        <motion.div
                            key={report._id}
                            className="bg-white rounded-lg p-6 shadow-md border border-gray-200"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="flex flex-col sm:flex-row justify-between">
                                <div>
                                    <p className="text-xl font-semibold text-gray-800">
                                        {report.reporter.fullName}
                                    </p>
                                    <p className="text-gray-600 flex items-center gap-2 mt-1">
                                        <FaCalendarAlt className="text-red-500" />
                                        {new Date(report.createdAt).toLocaleDateString()}
                                        <FaClock className="text-gray-600" />
                                        {new Date(report.createdAt).toLocaleTimeString()}
                                    </p>
                                    <p className="mt-2 text-gray-700">
                                        <strong>Location:</strong> {report.location}
                                    </p>
                                </div>
                                <div className="mt-3 sm:mt-0">
                                    <button
                                        onClick={() => setSelectedReport(report)}
                                        className="bg-blue-500 text-white px-4 py-2 mb-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition"
                                    >
                                        <FaEye /> View Details
                                    </button>
                                    <p className="text-md font-semibold text-gray-800">
                                        Report Number:
                                        <br></br>
                                        <p className=" flex justify-between items-center"> {report.incidentReportNumber}</p>

                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center items-center gap-4 mt-6">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="px-4 py-2 bg-gray-300 rounded-lg flex items-center gap-2 disabled:opacity-50"
                >
                    <FaArrowLeft /> Prev
                </button>
                <span>
                    Page {page} of {totalPages}
                </span>
                <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="px-4 py-2 bg-gray-300 rounded-lg flex items-center gap-2 disabled:opacity-50"
                >
                    Next <FaArrowRight />
                </button>
            </div>

            {/* Add Incident Report Modal */}
            {showForm && (
                <AddIncidentReportForm
                    universityData={universityData}
                    onClose={() => setShowForm(false)}
                />
            )}

            {/* Incident Report Details Modal */}
            {selectedReport && (
                <IncidentReportDetails
                    report={selectedReport}
                    onClose={() => setSelectedReport(null)}
                />
            )}
        </div>
    );
}
