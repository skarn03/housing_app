import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { useImage } from "../../../Hooks/useImage";
import { AuthContext } from "../../../Hooks/AuthContext";
import axios from "axios";


export default function AddStudentForm({ onSave, onClose, universityData }) {
    const auth = useContext(AuthContext);
    const { uploadImage } = useImage();
    const [newStudent, setNewStudent] = useState({
        preferredName: "", firstName: "", lastName: "", dateOfBirth: "", age: "", gender: "",
        picture: "", studentNumber: "", entryID: "", classification: "", entryStatus: "",
        email: "", building: "", floor: "", room: "", typeLocation: "",
        contractDates: { start: "", end: "" }, roomRate: "", packages: [], incidentReports: [], studentConnectionNotes: []
    });
    const [preview, setPreview] = useState("");
    const [selectedBuilding, setSelectedBuilding] = useState("");
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewStudent(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleSave = async () => {
        setUploading(true);
        try {
            let imageUrl = newStudent.picture;
    
            // Upload image if a file is selected
            if (file) {
                const uploadedImage = await uploadImage(file);
                imageUrl = uploadedImage.img;
            }
    
            const studentData = { ...newStudent, picture: imageUrl };
            const backendURL = process.env.BACKEND_URL || 'http://localhost:8000/api/';
            console.log(auth.token)
            // Call backend API to save student with token authentication
            const response = await axios.post(
                `${backendURL}student/add`, 
                studentData, 
                {
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${auth.token}` // Secure Token Authentication
                    }
                }
            );

    
            if (response.status === 201) {
                onSave(response.data);
                onClose();
            } else {
                console.error("Failed to save student:", response.data);
            }
        } catch (error) {
            console.error("Error saving student:", error);
        } finally {
            setUploading(false);
        }
    };
    

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeInOut" }} className="p-4 bg-white border rounded-2xl shadow-xl mb-6">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-700">Add New Student</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information Section */}
                <div className="p-6 border rounded-2xl shadow-md bg-gray-50">
                    <h3 className="text-xl font-semibold mb-4 text-gray-600">Personal Information</h3>
                    <label className="w-36 h-36 mb-4 rounded-full border-4 border-gray-400 flex items-center justify-center cursor-pointer overflow-hidden mx-auto transition hover:border-blue-500">
                        {preview ? (
                            <img src={preview} alt="Profile Preview" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-gray-500">Upload</span>
                        )}
                        <input type="file" name="picture" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                    <motion.input whileFocus={{ scale: 1.02 }} name="preferredName" placeholder="Preferred Name" onChange={handleChange} className="border p-3 w-full mb-3 rounded-lg transition focus:ring-2 focus:ring-blue-500" />
                    <motion.input whileFocus={{ scale: 1.02 }} name="firstName" placeholder="First Name" onChange={handleChange} className="border p-3 w-full mb-3 rounded-lg transition focus:ring-2 focus:ring-blue-500" />
                    <motion.input whileFocus={{ scale: 1.02 }} name="lastName" placeholder="Last Name" onChange={handleChange} className="border p-3 w-full mb-3 rounded-lg transition focus:ring-2 focus:ring-blue-500" />
                    <motion.input whileFocus={{ scale: 1.02 }} type="date" name="dateOfBirth" onChange={handleChange} className="border p-3 w-full mb-3 rounded-lg transition focus:ring-2 focus:ring-blue-500" />
                    <motion.input whileFocus={{ scale: 1.02 }} name="age" type="number" placeholder="Age" onChange={handleChange} className="border p-3 w-full mb-3 rounded-lg transition focus:ring-2 focus:ring-blue-500" />
                    <motion.select whileFocus={{ scale: 1.02 }} name="gender" onChange={handleChange} className="border p-3 w-full mb-3 rounded-lg transition focus:ring-2 focus:ring-blue-500">
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </motion.select>
                </div>

                {/* University Details */}
                <div className="p-6 border rounded-2xl shadow-md bg-gray-50">
                    <h3 className="text-xl font-semibold mb-4 text-gray-600">University Details</h3>
                    <motion.input whileFocus={{ scale: 1.02 }} name="email" placeholder="Email" onChange={handleChange} className="border p-3 w-full mb-3 rounded-lg transition focus:ring-2 focus:ring-blue-500" />
                    <motion.input whileFocus={{ scale: 1.02 }} name="studentNumber" placeholder="Student Number" onChange={handleChange} className="border p-3 w-full mb-3 rounded-lg transition focus:ring-2 focus:ring-blue-500" />
                    
                    {/* Classification Dropdown */}
                    <motion.select whileFocus={{ scale: 1.02 }} name="classification" onChange={handleChange} className="border p-3 w-full mb-3 rounded-lg transition focus:ring-2 focus:ring-blue-500">
                        <option value="">Select Classification</option>
                        <option value="New">New</option>
                        <option value="Returning">Returning</option>
                        <option value="Transfer">Transfer</option>
                    </motion.select>

                    {/* Entry Status Dropdown */}
                    <motion.select whileFocus={{ scale: 1.02 }} name="entryStatus" onChange={handleChange} className="border p-3 w-full mb-3 rounded-lg transition focus:ring-2 focus:ring-blue-500">
                        <option value="">Select Entry Status</option>
                        <option value="In Room">In Room</option>
                        <option value="Pending">Pending</option>
                        <option value="Withdrawn">Withdrawn</option>
                        <option value="Moved Out">Moved Out</option>
                    </motion.select>

                    {/* Building Dropdown */}
                    <motion.select whileFocus={{ scale: 1.02 }} name="building" onChange={(e) => {
                        setSelectedBuilding(e.target.value);
                        handleChange(e);
                    }} className="border p-3 w-full mb-3 rounded-lg transition focus:ring-2 focus:ring-blue-500">
                        <option value="">Select Building</option>
                        {universityData?.buildings?.map((building) => (
                            <option key={building._id} value={building.name}>{building.name}</option>
                        ))}
                    </motion.select>

                    {/* Floor Dropdown */}
                    <motion.select whileFocus={{ scale: 1.02 }} name="floor" onChange={handleChange} className="border p-3 w-full mb-3 rounded-lg transition focus:ring-2 focus:ring-blue-500">
                        <option value="">Select Floor</option>
                        {universityData?.buildings?.find((b) => b.name === selectedBuilding)?.floors?.map((floor) => (
                            <option key={floor._id} value={floor.name}>{floor.name}</option>
                        ))}
                    </motion.select>

                    <motion.input whileFocus={{ scale: 1.02 }} name="room" placeholder="Room" onChange={handleChange} className="border p-3 w-full mb-3 rounded-lg transition focus:ring-2 focus:ring-blue-500" />
                </div>
            </div>
            <button onClick={onClose} className="bg-gray-400 mx-4 text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition">
                    Cancel
                </button>
            {/* Save Button */}
            <button onClick={handleSave} className="bg-blue-500 text-white px-6 py-3 rounded-lg mt-6 hover:bg-blue-600 transition" disabled={uploading}>
                {uploading ? "Saving..." : "Add Student"}
            </button>
        </motion.div>
    );
}
