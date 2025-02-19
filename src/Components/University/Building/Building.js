import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaBuilding, FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";
import { AuthContext } from "../../../Hooks/AuthContext";
import AddBuildingForm from "./AddBuildingForm";

export default function Buildings({ universityData }) {
    const auth = useContext(AuthContext);
    const [buildings, setBuildings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editMode, setEditMode] = useState(null);
    const [editedBuilding, setEditedBuilding] = useState({ name: "", floors: [] });

    const backendURL = process.env.BACKEND_URL || "http://localhost:8000/api/";

    // Fetch buildings from backend
    useEffect(() => {
        const fetchBuildings = async () => {
            if (!universityData || !auth.token) return;
            setLoading(true);
            setError(null);

            try {
                console.log("🏢 Fetching buildings...");
                const response = await axios.get(`${backendURL}building/getBuildings`, {
                    headers: {
                        "Authorization": `Bearer ${auth.token}`,
                        "Content-Type": "application/json"
                    }
                });

                setBuildings(response.data.buildings);
                console.log("✅ Buildings fetched:", response.data.buildings);
            } catch (err) {
                console.error("❌ Error fetching buildings:", err);
                setError("Failed to load buildings.");
            } finally {
                setLoading(false);
            }
        };

        fetchBuildings();
    }, [universityData, auth.token]);

    // Add new building
    const addBuilding = (newBuilding) => {
        setBuildings((prevBuildings) => [...prevBuildings, newBuilding]);
        setShowForm(false);
    };

    // Delete building
    const deleteBuilding = async (buildingId) => {
        if (!window.confirm("Are you sure you want to delete this building?")) return;
        try {
            console.log(`🗑️ Deleting building: ${buildingId}`);
            await axios.delete(`${backendURL}building/delete/${buildingId}`, {
                headers: { "Authorization": `Bearer ${auth.token}` }
            });

            setBuildings((prevBuildings) => prevBuildings.filter(building => building._id !== buildingId));
            console.log("✅ Building deleted successfully.");
        } catch (err) {
            console.error("❌ Error deleting building:", err);
            setError("Failed to delete building.");
        }
    };

    // Edit building
    const startEdit = (building) => {
        setEditMode(building._id);
        setEditedBuilding({ name: building.name, floors: building.floors.map(floor => floor.name) });
    };

    // Add new floor during edit
    const addFloor = () => {
        setEditedBuilding((prev) => ({
            ...prev,
            floors: [...prev.floors, ""]
        }));
    };

    // Delete floor during edit
    const deleteFloor = (index) => {
        setEditedBuilding((prev) => ({
            ...prev,
            floors: prev.floors.filter((_, i) => i !== index)
        }));
    };

    // Save edited building
    const saveEdit = async (buildingId) => {
        try {
            console.log(`💾 Saving edits for building: ${buildingId}`);
            const response = await axios.put(
                `${backendURL}building/update/${buildingId}`,
                { name: editedBuilding.name, floors: editedBuilding.floors },
                {
                    headers: {
                        "Authorization": `Bearer ${auth.token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            setBuildings((prevBuildings) =>
                prevBuildings.map((building) =>
                    building._id === buildingId ? { ...building, ...response.data.building } : building
                )
            );

            setEditMode(null);
            console.log("✅ Building updated successfully.");
        } catch (err) {
            console.error("❌ Error updating building:", err);
            setError("Failed to update building.");
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="p-6 font-Poppins">
            <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
                <h2 className="text-3xl font-bold text-gray-800">🏢 Buildings</h2>
                <button onClick={() => setShowForm(true)} className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-3 rounded-xl shadow-md flex items-center gap-2 hover:scale-105 transition-transform">
                    <FaPlus /> Add Building
                </button>
            </div>

            {showForm && <AddBuildingForm onSave={addBuilding} onClose={() => setShowForm(false)} universityData={universityData} />}

            {loading ? (
                <p className="text-center text-gray-500">Loading buildings...</p>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {buildings.length === 0 ? (
                        <p className="text-center text-gray-500">No buildings found.</p>
                    ) : (
                        buildings.map((building) => (
                            <motion.div 
                                key={building._id} 
                                className="relative bg-white bg-opacity-80 backdrop-blur-md border rounded-xl shadow-lg p-6 transition-all hover:shadow-2xl hover:-translate-y-2"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {editMode === building._id ? (
                                    <div>
                                        <input
                                            type="text"
                                            value={editedBuilding.name}
                                            onChange={(e) => setEditedBuilding({ ...editedBuilding, name: e.target.value })}
                                            className="border p-2 w-full mb-2 rounded-lg"
                                        />
                                        {editedBuilding.floors.map((floor, index) => (
                                            <div key={index} className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={floor}
                                                    onChange={(e) => {
                                                        const newFloors = [...editedBuilding.floors];
                                                        newFloors[index] = e.target.value;
                                                        setEditedBuilding({ ...editedBuilding, floors: newFloors });
                                                    }}
                                                    className="border p-2 w-full rounded-lg"
                                                />
                                                <button onClick={() => deleteFloor(index)} className="text-red-500">
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        ))}
                                        <button onClick={addFloor} className="text-green-500 mt-2">
                                            <FaPlus /> Add Floor
                                        </button>
                                        <div className="flex justify-end gap-2 mt-4">
                                            <button onClick={() => saveEdit(building._id)} className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition">
                                                <FaSave /> Save
                                            </button>
                                            <button onClick={() => setEditMode(null)} className="bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600 transition">
                                                <FaTimes /> Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <h3 className="text-xl font-semibold flex items-center">
                                            <FaBuilding className="mr-2 text-blue-600" /> {building.name}
                                        </h3>
                                        <p className="text-gray-600">Floors: {building.floors.length}</p>
                                        <ul className="mt-2 text-gray-500 text-sm">
                                            {building.floors.map((floor) => (
                                                <li key={floor._id}>• {floor.name}</li>
                                            ))}
                                        </ul>
                                    </>
                                )}
                                <div className="absolute top-2 right-2 flex gap-2">
                                    <button onClick={() => startEdit(building)} className="text-yellow-500">
                                        <FaEdit />
                                    </button>
                                    <button onClick={() => deleteBuilding(building._id)} className="text-red-500">
                                        <FaTrash />
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            )}
        </motion.div>
    );
}
