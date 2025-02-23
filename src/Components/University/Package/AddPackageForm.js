import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { AuthContext } from "../../../Hooks/AuthContext";

export default function AddPackageForm({ onClose, buildings }) {
    const auth = useContext(AuthContext);
    const [formData, setFormData] = useState({
        trackingNumber: "",
        recipient: "",
        parcelType: "",
        shippingType: "",
        receiptDate: new Date().toISOString().split("T")[0], // Default to today
        receiptTime: new Date().toLocaleTimeString(), // Default to current time
        comments: "",
        building: "",
        staff: auth.user?._id || "", // Assuming staff ID comes from auth
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (searchTerm.length < 3) return;

        const delayDebounceFn = setTimeout(async () => {
            setLoading(true);
            try {
                const backendURL = process.env.BACKEND_URL || "http://localhost:8000/api/";
                const response = await axios.get(`${backendURL}student/getStudents`, {
                    params: { search: searchTerm, limit: 5 },
                    headers: { "Authorization": `Bearer ${auth.token}`, "Content-Type": "application/json" }
                });

                setSearchResults(response.data.students);
            } catch (error) {
                console.error("Error fetching students:", error);
            } finally {
                setLoading(false);
            }
        }, 1500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectRecipient = (student) => {
        setFormData({ ...formData, recipient: student._id });
        setSearchTerm(`${student.firstName} ${student.lastName} (${student.studentNumber})`);
        setSearchResults([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);
        try {
            const backendURL = process.env.BACKEND_URL || "http://localhost:8000/api/";
            await axios.post(`${backendURL}package/add`, formData, {
                headers: { "Authorization": `Bearer ${auth.token}`, "Content-Type": "application/json" }
            });
            onClose();
        } catch (error) {
            console.error("Error saving package:", error);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.3 }}
            className="p-6 bg-gray-100 rounded-lg shadow-md mt-4"
        >
            <h3 className="text-lg font-semibold mb-4">Add New Package</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Recipient Search */}
                <input 
                    type="text" 
                    name="recipient" 
                    placeholder="Search Recipient" 
                    className="border p-2 rounded" 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {loading && <p>Searching...</p>}
                {searchResults.length > 0 && (
                    <ul className="border p-2 rounded bg-white max-h-40 overflow-y-auto">
                        {searchResults.map((student) => (
                            <li key={student._id} className="p-2 hover:bg-gray-200 cursor-pointer flex items-center gap-3"
                                onClick={() => handleSelectRecipient(student)}>
                                <img src={student.picture || "https://example.com/default-profile.png"} alt="Profile" className="w-8 h-8 rounded-full" />
                                <div>
                                    <p className="font-semibold">{student.firstName} {student.lastName}</p>
                                    <p className="text-sm text-gray-500">{student.studentNumber} - {student.room || "No Room Assigned"}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
                <input type="text" name="trackingNumber" placeholder="Tracking Number" className="border p-2 rounded" onChange={handleChange} required />

                {/* Parcel Type */}
                <select name="parcelType" className="border p-2 rounded" onChange={handleChange} required>
                    <option value="">Select Parcel Type</option>
                    {[
                        "Box/Bag - Large and Up",
                        "Box/Bag - Medium",
                        "Box/Bag - Small",
                        "Care Package",
                        "Conduct Letter",
                        "Envelope-Financial Doc/Cards",
                        "Envelope-IRS Document",
                        "Envelope-Large",
                        "Other-add type to comments",
                        "Perishable-Flowers",
                        "Perishable-Food",
                        "Perishable-Other"
                    ].map(type => <option key={type} value={type}>{type}</option>)}
                </select>

                {/* Shipping Type */}
                <select name="shippingType" className="border p-2 rounded" onChange={handleChange} required>
                    <option value="">Select Shipping Type</option>
                    {["DHL", "FedEx", "Metro Delivery", "Other", "UPS", "USPS"].map(type => <option key={type} value={type}>{type}</option>)}
                </select>

                {/* Receipt Date & Time */}
                <input type="date" name="receiptDate" className="border p-2 rounded" value={formData.receiptDate} onChange={handleChange} required />
                <input type="text" name="receiptTime" className="border p-2 rounded" value={formData.receiptTime} readOnly />

                {/* Building Dropdown */}
                <select name="building" className="border p-2 rounded" onChange={handleChange} required>
                    <option value="">Select Building</option>
                    {buildings.map(building => <option key={building._id} value={building._id}>{building.name}</option>)}
                </select>

                {/* Comments */}
                <textarea name="comments" placeholder="Comments" className="border p-2 rounded col-span-2" onChange={handleChange}></textarea>

                {/* Action Buttons */}
                <div className="col-span-2 flex justify-end gap-2">
                    <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition">Cancel</button>
                    <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">Save Package</button>
                </div>
            </form>
        </motion.div>
    );
}
