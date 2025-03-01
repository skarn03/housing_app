import React, { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { FaTimes, FaTrash } from "react-icons/fa";
import { AuthContext } from "../../../Hooks/AuthContext";
import { useImage } from "../../../Hooks/useImage";
import axios from "axios";

export default function AddIncidentReportForm({ onClose, universityData }) {
    const auth = useContext(AuthContext);
    const { uploadImage } = useImage();
    const backendURL = process.env.BACKEND_URL || "http://localhost:8000/api/";

    const [formData, setFormData] = useState({
        reporter: {
            fullName: "",
            position: "",
            phoneNumber: "",
            email: "",
            physicalAddress: "",
        },
        nature: "",
        date: "",
        time: "",
        location: "",
        specificLocation: "",
        involvedParties: [],
        description: "",
        campusPoliceResponse: "",
        reportNumber: "",
        supportingDocuments: [],
    });

    // Set default date and time on mount
    useEffect(() => {
        const currentDate = new Date().toISOString().split("T")[0];
        const currentTime = new Date().toISOString().substring(11, 16);
        setFormData((prev) => ({ ...prev, date: currentDate, time: currentTime }));
    }, []);

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
        "Women's Softball Field",
    ];

    // NEW: States for searching and selecting students for involved parties
    const [searchTerm, setSearchTerm] = useState("");
    const [students, setStudents] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // newParty now stores the selected student and role, plus extra details
    const [newParty, setNewParty] = useState({
        student: "",
        studentName: "",
        role: "",
        studentNumber: "",
        studentBuilding: "",
        studentRoom: "",
        studentPicture: "",
    });
    const [imagePreviews, setImagePreviews] = useState([]);

    // Fetch students based on search term using the provided API
    useEffect(() => {
        const fetchStudents = async () => {
            if (!universityData || !auth.token || searchTerm.trim() === "") return;
            setLoading(true);
            setError(null);
            try {
                console.log("📡 Fetching students with multiple filters...");
                const response = await axios.get(`${backendURL}student/getStudents`, {
                    params: {
                        universityId: universityData._id,
                        search: searchTerm,
                        page,
                        limit: 10,
                    },
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                        "Content-Type": "application/json",
                    },
                });
                setStudents(response.data.students);
                setTotalPages(response.data.totalPages);
                console.log("✅ Students fetched:", response.data.students);
            } catch (err) {
                console.error("❌ Error fetching students:", err);
                setError("Failed to load students.");
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, [universityData, searchTerm, page, auth.token]);

    // General field change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Reporter fields change
    const handleReporterChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            reporter: { ...prev.reporter, [name]: value },
        }));
    };

    // Involved party local state change
    const handlePartyChange = (e) => {
        const { name, value } = e.target;
        setNewParty((prev) => ({ ...prev, [name]: value }));
    };

    // Add involved party (must have a selected student and role)
    const addInvolvedParty = () => {
        if (newParty.student && newParty.role) {
            setFormData((prev) => ({
                ...prev,
                involvedParties: [...prev.involvedParties, newParty],
            }));
            setNewParty({
                student: "",
                studentName: "",
                role: "",
                studentNumber: "",
                studentBuilding: "",
                studentRoom: "",
                studentPicture: "",
            });
            setSearchTerm("");
            setStudents([]);
        }
    };

    // Remove an involved party from the list
    const removeInvolvedParty = (index) => {
        setFormData((prev) => ({
            ...prev,
            involvedParties: prev.involvedParties.filter((_, i) => i !== index),
        }));
    };

    // Handle image file selection and preview generation
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map((file) => ({
            file,
            previewURL: URL.createObjectURL(file),
        }));
        setImagePreviews((prev) => [...prev, ...newImages]);
        setFormData((prev) => ({
            ...prev,
            supportingDocuments: [...prev.supportingDocuments, ...files],
        }));
    };

    // Remove a selected image
    const removeImage = (index) => {
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
        setFormData((prev) => ({
            ...prev,
            supportingDocuments: prev.supportingDocuments.filter((_, i) => i !== index),
        }));
    };

    // Submit form data after uploading images and obtaining URLs
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const uploadedImageURLs = await Promise.all(
                formData.supportingDocuments.map(async (file) => {
                    const uploadedImg = await uploadImage(file);
                    return uploadedImg.img;
                })
            );

            const payload = {
                ...formData,
                supportingDocuments: uploadedImageURLs,
            };

            const response = await axios.post(`${backendURL}incidentreport/add`, payload, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${auth.token}`,
                },
            });

            if (response.status === 201) {
                alert("Incident Report Submitted Successfully!");
                onClose();
            } else {
                alert("Failed to submit the report.");
            }
        } catch (error) {
            console.error("Error submitting incident report:", error);
            alert("Failed to submit the report.");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4"
        >
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl max-h-[85vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">🚔 Add Incident Report</h2>
                    <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Reporter Details */}
                    <div>
                        <h3 className="font-semibold">🧑 Reporter Details</h3>
                        <input
                            type="text"
                            name="fullName"
                            placeholder="Full Name"
                            value={formData.reporter.fullName}
                            onChange={handleReporterChange}
                            required
                            className="w-full p-2 border rounded mt-2"
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.reporter.email}
                            onChange={handleReporterChange}
                            required
                            className="w-full p-2 border rounded mt-2"
                        />
                        <select
                            name="position"
                            value={formData.reporter.position}
                            onChange={handleReporterChange}
                            required
                            className="w-full p-2 border rounded mt-2"
                        >
                            <option value="">Select Position</option>
                            <option value="RA">RA</option>
                            <option value="GHD">GHD</option>
                            <option value="CD">CD</option>
                            <option value="Central Housing">Central Housing</option>
                            <option value="SuperAdmin">SuperAdmin</option>
                        </select>
                        <input
                            type="text"
                            name="phoneNumber"
                            placeholder="Phone Number"
                            value={formData.reporter.phoneNumber}
                            onChange={handleReporterChange}
                            className="w-full p-2 border rounded mt-2"
                        />
                        <input
                            type="text"
                            name="physicalAddress"
                            placeholder="Physical Address"
                            value={formData.reporter.physicalAddress}
                            onChange={handleReporterChange}
                            className="w-full p-2 border rounded mt-2"
                        />
                    </div>

                    {/* Incident Details */}
                    <div>
                        <h3 className="font-semibold">📌 Incident Details</h3>
                        <select
                            name="nature"
                            value={formData.nature}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded mt-2"
                        >
                            <option value="" disabled>
                                Select Nature of Report
                            </option>
                            <option value="Housing">Housing</option>
                            <option value="Residence Life Conduct">Residence Life Conduct</option>
                            <option value="Student Conduct">Student Conduct</option>
                        </select>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded mt-2"
                        />
                        <input
                            type="time"
                            name="time"
                            value={formData.time}
                            onChange={handleChange}
                            className="w-full p-2 border rounded mt-2"
                        />
                        <div className="mt-2">
                            <h3 className="font-semibold">📍 Location of Incident</h3>
                            <select
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border rounded mt-2"
                            >
                                <option value="" disabled hidden>
                                    Select a location...
                                </option>
                                {LOCATION_OPTIONS.map((loc, index) => (
                                    <option key={index} value={loc}>
                                        {loc}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <input
                            type="text"
                            name="specificLocation"
                            placeholder="Specific Location"
                            value={formData.specificLocation}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded mt-2"
                        />
                        <textarea
                            name="description"
                            placeholder="Detailed description of the incident..."
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows="5"
                            className="w-full p-2 border rounded mt-2"
                        />
                        <select
                            name="campusPoliceResponse"
                            value={formData.campusPoliceResponse}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded mt-2"
                        >
                            <option value="">Did Police Respond</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                            <option value="I don't know">I don't know</option>
                        </select>
                        <input
                            type="text"
                            name="reportNumber"
                            placeholder="Report Number"
                            value={formData.reportNumber}
                            onChange={handleChange}
                            className="w-full p-2 border rounded mt-2"
                        />
                    </div>

                    {/* Involved Parties */}
                    <div>
                        <h3 className="font-semibold">👥 Involved Parties</h3>
                        {newParty.student ? (
                            <div className="flex gap-2 items-center border p-2 rounded">
                                {newParty.studentPicture && (
                                    <img
                                        src={newParty.studentPicture}
                                        alt={newParty.studentName}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                )}
                                <div>
                                    <div className="font-semibold">{newParty.studentName}</div>
                                    <div className="text-sm text-gray-500">
                                        Student Number: {newParty.studentNumber}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {newParty.studentBuilding}{" "}
                                        {newParty.studentRoom && `- Room: ${newParty.studentRoom}`}
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setNewParty({
                                            student: "",
                                            studentName: "",
                                            role: newParty.role,
                                            studentNumber: "",
                                            studentBuilding: "",
                                            studentRoom: "",
                                            studentPicture: "",
                                        })
                                    }
                                    className="ml-auto text-blue-500 hover:underline"
                                >
                                    Change
                                </button>
                            </div>
                        ) : (
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search Students"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full p-2 border rounded"
                                />
                                {loading && <div className="mt-1 text-sm">Loading...</div>}
                                {error && (
                                    <div className="mt-1 text-sm text-red-500">{error}</div>
                                )}
                                {students.length > 0 && searchTerm.trim() !== "" && (
                                    <ul className="absolute z-10 w-full bg-white border rounded mt-1 max-h-60 overflow-y-auto">
                                        {students.map((student) => (
                                            <li
                                                key={student._id}
                                                onClick={() => {
                                                    setNewParty({
                                                        student: student._id,
                                                        studentName: `${student.firstName} ${student.lastName}`,
                                                        studentNumber: student.studentNumber,
                                                        studentBuilding: student.building,
                                                        studentRoom: student.room,
                                                        studentPicture: student.picture,
                                                        role: newParty.role, // preserve role if already set
                                                    });
                                                    setSearchTerm("");
                                                    setStudents([]);
                                                }}
                                                className="p-2 hover:bg-gray-100 cursor-pointer flex gap-2 items-center"
                                            >
                                                {student.picture && (
                                                    <img
                                                        src={student.picture}
                                                        alt={`${student.firstName} ${student.lastName}`}
                                                        className="w-10 h-10 rounded-full object-cover"
                                                    />
                                                )}
                                                <div>
                                                    <div className="font-semibold">
                                                        {student.firstName} {student.lastName}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        Student Number: {student.studentNumber}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {student.building}{" "}
                                                        {student.room && `- Room: ${student.room}`}
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}
                        {/* Role Dropdown */}
                        <select
                            name="role"
                            value={newParty.role}
                            onChange={handlePartyChange}
                            className="w-full p-2 border rounded mt-2"
                        >
                            <option value="">Select Role</option>
                            <option value="Respondant">Respondant</option>
                            <option value="complainant">complainant</option>
                            <option value="Witness">Witness</option>
                            <option value="student of concern">student of concern</option>
                        </select>
                        <button
                            type="button"
                            onClick={addInvolvedParty}
                            className="bg-blue-500 text-white p-2 rounded mt-2"
                        >
                            Add
                        </button>
                        <ul className="mt-2">
                            {formData.involvedParties.map((party, index) => (
                                <li
                                    key={index}
                                    className="flex justify-between items-center border p-2 rounded mt-2"
                                >
                                    <div className="flex gap-2 items-center">
                                        {party.studentPicture && (
                                            <img
                                                src={party.studentPicture}
                                                alt={party.studentName}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                        )}
                                        <div>
                                            <div className="font-semibold">{party.studentName}</div>
                                            <div className="text-sm text-gray-500">
                                                Student Number: {party.studentNumber} - {party.studentBuilding}{" "}
                                                {party.studentRoom && `- Room: ${party.studentRoom}`}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span>{party.role}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeInvolvedParty(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Supporting Documents */}
                    <div>
                        <h3 className="font-semibold">📷 Upload Images</h3>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="w-full p-2 border rounded mt-2"
                        />
                        <div className="grid grid-cols-3 gap-2 mt-3">
                            {imagePreviews.map((img, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={img.previewURL}
                                        alt="Preview"
                                        className="w-full h-24 object-cover rounded-lg shadow"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 w-full"
                    >
                        Submit Report
                    </button>
                </form>
            </div>
        </motion.div>
    );
}
