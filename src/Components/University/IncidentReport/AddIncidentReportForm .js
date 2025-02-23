import React, { useState,useContext } from "react";
import { motion } from "framer-motion";
import { FaTimes, FaTrash, FaUpload } from "react-icons/fa";
import { AuthContext } from "../../../Hooks/AuthContext";
import { useImage } from "../../../Hooks/useImage";
import axios from "axios";
export default function AddIncidentReportForm({ onClose }) {
    const auth = useContext(AuthContext);
    const { uploadImage } = useImage();

    const [formData, setFormData] = useState({
        reporter: { fullName: "", position: "", phoneNumber: "", email: "", physicalAddress: "" },
        nature: "",
        date: "",
        time: "",
        location: "",
        specificLocation: "",
        involvedParties: [],
        description: "",
        campusPoliceResponse: "",
        reportNumber: "",
        supportingDocuments: []
    });
    const LOCATION_OPTIONS = [
        "601 W Forest", "611 W Cross Lot", "611 W Cross-Psychology Clinic", "Academic Buildings",
        "Academic Dishonesty- No Building", "Administrative Buildings", "Administrative Offices",
        "Alexander Music Building", "Alexander Pay Lot", "Ann Street", "Anne Street Lot",
        "Apartments Parking", "Athletic Facilities", "Best Hall", "Best-Outside", "Boone Hall",
        "Bowen Field House", "Bowen Lot", "Bowman-Roosevelt Lot", "Briggs Hall",
        "Brown Apartments", "Brown-Outside", "Buell Hall", "Buell-Outside", "Central HRL Office",
        "Central Receiving", "Chippewa Club", "College of Business Structure", "College Place",
        "Common Ground Cafe @ Marshall Hall", "Convocation Center", "Cornell Court",
        "Cornell Courts Apartments", "Cornell Street", "Corporate Education Center",
        "Cross Street", "Department of Public Safety Office", "Dining Facilities",
        "Dining Services Office", "Downing Hall", "Downing-Outside", "E Circle Drive",
        "Eagle Crest Golf Club", "Eagles Cafe @ Alexander Music Building",
        "Eagles Cafe @ College of Business-remove", "Eagles Cafe @ Halle Library",
        "Eagles Cafe @ Mark Jefferson", "Eagles Cafe @ McKenny Hall",
        "Eagles Cafe @ Pray Harrold", "Eastbrook", "Eastern Eateries",
        "Failure to Comply-No Building", "Fletcher Lot", "Fletcher School",
        "Food for Thought @ Sill Hall", "Ford Hall", "Ford Lake", "Ford Lot A",
        "Ford Lot B", "Ford Reserved Lot", "Geddes Town Hall School House",
        "Green Lot 1", "Halle Library", "Hewitt", "Hill-Outside", "Hover Building",
        "Hoyt Hall", "Hoyt Lot", "Hoyt-Outside", "Huron River Drive",
        "Indoor Practice Facility", "Indoor Practice Facility Lot",
        "Jones Goddard", "Jones Pool", "Key Bank Lot", "King Hall", "Lake House",
        "Lakeview Hall", "Lowell", "Mark Jefferson Lot", "Mark Jefferson Science Building",
        "Market Place", "Marshall Building", "Mayhew", "Mayhew Lot 1", "Mayhew Lot 2",
        "McKenny Hall", "McKenny Staff Lot", "McKinney Pay Lot", "Munson Apartments",
        "Normal Reserved Lot", "Normal Street Lot", "North Campus Lot 1",
        "North Campus Lot 2", "Oakwood", "Oakwood Lot North", "Oakwood Lot South",
        "Oakwood Meters", "Oakwood Pay Lot", "Oestrike Stadium", "Off campus",
        "Olds-Marshall Track", "Olds-Robb Student Recreation Center",
        "Outside of a Building", "Owen Building-College of Business", "Parking Facilities",
        "Parking Structure", "Pease Auditorium", "Pease Lot", "Pease Pay Lot", "Perrin",
        "Phelps Hall", "Phelps-Outside", "Physical Plant Parking", "Pierce Hall",
        "Pittman Hall", "Pittman-Outside", "Porter Building", "Porter Park",
        "Pray-Harrold Classroom Building", "Pray-Harrold Metered Parking",
        "Putnam Hall", "Putnam-Outside", "Quirk Dramatic Arts Building/Theatre",
        "Rackham Building", "Residence Hall Metered Parking", "Return from Suspension",
        "Roosevelt Hall", "Rynearson Lot", "Rynearson Stadium", "Saint John",
        "Scicluna Field (Soccer Fields)", "Sculpture Studio", "Sellers Hall",
        "Sellers-Outside", "Sherzer Hall", "Sill Hall", "Sill Lot", "Smith Reserved Lot",
        "Snow Health Center-REMOVE, add Judy Sturgis Hill", "Snow Lot", "Softball Complex",
        "Sponberg Theatre", "Starbucks-Student Center", "Starkweather Hall",
        "Strong Physical Science Building", "Student Center", "Student Center Pay Lot",
        "Tennis Courts", "Terrestrial and Aquatics Research Facility",
        "The Commons", "The Village", "The Village-Outside", "University House",
        "University Housing Office-remove", "University Park", "Unknown",
        "Varsity Field", "via Electronic means", "W Circle Drive", "Walton Hall",
        "Walton-Outside", "Warner Gymnasium", "Washington Street Lot",
        "Washtenaw Avenue", "Welch Hall", "West Forest", "Westview", "Westview Hall",
        "Wise Hall", "Wise-Outside", "Women's Softball Field"
    ];

    const [newParty, setNewParty] = useState({ studentName: "", role: "", idNumber: "" });
    const [imagePreviews, setImagePreviews] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleReporterChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            reporter: { ...prev.reporter, [name]: value }
        }));
    };

    const handlePartyChange = (e) => {
        const { name, value } = e.target;
        setNewParty((prev) => ({ ...prev, [name]: value }));
    };

    const addInvolvedParty = () => {
        if (newParty.studentName && newParty.role) {
            setFormData((prev) => ({
                ...prev,
                involvedParties: [...prev.involvedParties, newParty]
            }));
            setNewParty({ studentName: "", role: "", idNumber: "" });
        }
    };

    const removeInvolvedParty = (index) => {
        setFormData((prev) => ({
            ...prev,
            involvedParties: prev.involvedParties.filter((_, i) => i !== index)
        }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);

        const newImages = files.map((file) => ({
            file,
            previewURL: URL.createObjectURL(file)
        }));

        setImagePreviews((prev) => [...prev, ...newImages]);
        setFormData((prev) => ({
            ...prev,
            supportingDocuments: [...prev.supportingDocuments, ...files]
        }));
    };

    const removeImage = (index) => {
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
        setFormData((prev) => ({
            ...prev,
            supportingDocuments: prev.supportingDocuments.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            // ✅ Upload each image to cloud and get the URLs
            const uploadedImageURLs = await Promise.all(
                formData.supportingDocuments.map(async (file) => {
                    const uploadedImg = await uploadImage(file);
                    return uploadedImg.img; // Extract the .img string URL
                })
            );
    
            // ✅ Prepare FormData for file upload
            const formDataToSend = new FormData();
            formDataToSend.append("reporter", JSON.stringify(formData.reporter));
            formDataToSend.append("nature", formData.nature);
            formDataToSend.append("date", formData.date);
            formDataToSend.append("time", formData.time);
            formDataToSend.append("location", formData.location);
            formDataToSend.append("specificLocation", formData.specificLocation);
            formDataToSend.append("description", formData.description);
            formDataToSend.append("campusPoliceResponse", formData.campusPoliceResponse);
            formDataToSend.append("reportNumber", formData.reportNumber);
    
            formData.involvedParties.forEach((party, index) => {
                formDataToSend.append(`involvedParties[${index}]`, JSON.stringify(party));
            });
    
            // ✅ Replace file blobs with uploaded image URLs
            uploadedImageURLs.forEach((imgUrl, index) => {
                formDataToSend.append(`supportingDocuments[${index}]`, imgUrl);
            });
    
            const backendURL = process.env.BACKEND_URL || 'http://localhost:8000/api/';


            // ✅ Send the incident report to the backend with Auth Headers using Axios
            await axios.post(`${backendURL}incidentreport/add`, formDataToSend, {
                headers: {
                    "Authorization": `Bearer ${auth.token}`, // 🔥 Use auth token
                    "Content-Type": "multipart/form-data" // Ensure correct content type
                }
            });
    
            alert("✅ Incident Report Submitted!");
            onClose();
        } catch (error) {
            console.error("❌ Error submitting incident report:", error);
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
                    {/* Reporter Info */}
                    <div>
                        <h3 className="font-semibold">🧑 Reporter Details</h3>
                        <input type="text" name="fullName" placeholder="Full Name" value={formData.reporter.fullName} onChange={handleReporterChange} required className="w-full p-2 border rounded mt-2" />
                        <input type="email" name="email" placeholder="Email" value={formData.reporter.email} onChange={handleReporterChange} required className="w-full p-2 border rounded mt-2" />
                    </div>

                    {/* Incident Details */}
                    <div>

                        <h3 className="font-semibold">📌 Incident Details</h3>
                        <input type="text" name="nature" placeholder="Nature of Incident" value={formData.nature} onChange={handleChange} required className="w-full p-2 border rounded mt-2" />
                        <input type="date" name="date" value={formData.date} onChange={handleChange} required className="w-full p-2 border rounded mt-2" />
                        <input type="time" name="time" value={formData.time} onChange={handleChange} className="w-full p-2 border rounded mt-2 mb-4" />
                        {/* Location Dropdown */}
                        <div>
                            <h3 className="font-semibold">📍 Location of Incident</h3>
                            <select
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border rounded mt-2"
                            >
                                <option value="" disabled hidden>Select a location...</option>
                                {LOCATION_OPTIONS.map((loc, index) => (
                                    <option key={index} value={loc}>{loc}</option>
                                ))}
                            </select>
                        </div>
                        <input type="text" name="specificLocation" placeholder="General Location" value={formData.specificLocation} onChange={handleChange} required className="w-full p-2 border rounded mt-2" />

                        {/* Incident Description */}
                        <h3 className="font-semibold mt-4">📝 Incident Description</h3>
                        <textarea
                            name="description"
                            placeholder="Provide a detailed description of the incident..."
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows="5"
                            className="w-full p-2 border rounded mt-2"
                        />
                    </div>

                    {/* Image Uploads */}
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
                                    <img src={img.previewURL} alt="Preview" className="w-full h-24 object-cover rounded-lg shadow" />
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
                    <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 w-full">
                        Submit Report
                    </button>
                </form>
            </div>
        </motion.div>
    );
}
