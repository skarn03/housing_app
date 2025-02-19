import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "../../../Hooks/AuthContext";
import axios from "axios";
import { FaTimes } from "react-icons/fa";

export default function AddBuildingForm({ onSave, onClose, universityData }) {
    const auth = useContext(AuthContext);
    const [buildingName, setBuildingName] = useState("");
    const [floors, setFloors] = useState([""]); // Array to store floor names
    const [loading, setLoading] = useState(false);

    const backendURL = process.env.BACKEND_URL || "http://localhost:8000/api/";

    const handleFloorChange = (index, value) => {
        const newFloors = [...floors];
        newFloors[index] = value;
        setFloors(newFloors);
    };

    const addFloorInput = () => {
        setFloors([...floors, ""]);
    };

    const removeFloorInput = (index) => {
        setFloors(floors.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        if (!buildingName.trim() || floors.some(floor => !floor.trim())) {
            alert("Please enter valid building and floor names.");
            return;
        }

        setLoading(true);
        try {
            const buildingData = {
                name: buildingName,
                floors,
                universityId: universityData._id
            };

            const response = await axios.post(`${backendURL}building/add`, buildingData, {
                headers: {
                    "Authorization": `Bearer ${auth.token}`,
                    "Content-Type": "application/json"
                }
            });

            if (response.status === 201) {
                onSave(response.data);
                onClose();
            } else {
                console.error("Failed to add building:", response.data);
            }
        } catch (error) {
            console.error("Error adding building:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="p-6 mb-5 bg-white border rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Add New Building</h2>
            <motion.input whileFocus={{ scale: 1.02 }} placeholder="Building Name" value={buildingName} onChange={(e) => setBuildingName(e.target.value)} className="border p-3 w-full mb-3 rounded-lg transition focus:ring-2 focus:ring-blue-500" />

            <h3 className="text-md font-semibold mb-2">Floors</h3>
            {floors.map((floor, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                    <motion.input whileFocus={{ scale: 1.02 }} placeholder={`Floor ${index + 1}`} value={floor} onChange={(e) => handleFloorChange(index, e.target.value)} className="border p-3 w-full rounded-lg transition focus:ring-2 focus:ring-blue-500" />
                    {floors.length > 1 && (
                        <button onClick={() => removeFloorInput(index)} className="text-red-500">
                            <FaTimes />
                        </button>
                    )}
                </div>
            ))}

            <button onClick={addFloorInput} className="bg-blue-500 text-white px-3 py-2 rounded-lg mt-2 hover:bg-blue-600 transition">
                Add Floor
            </button>

            <div className="mt-4 flex justify-end gap-2">
                <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition">
                    Cancel
                </button>
                <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition" disabled={loading}>
                    {loading ? "Saving..." : "Save Building"}
                </button>
            </div>
        </motion.div>
    );
}
