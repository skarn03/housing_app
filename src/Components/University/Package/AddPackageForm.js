import React, { useState } from "react";
import { motion } from "framer-motion";

export default function AddPackageForm({ onClose }) {
    const [formData, setFormData] = useState({
        trackingNumber: "",
        recipient: "",
        parcelType: "",
        shippingType: "",
        emailReceiptFrom: "",
        mailRoom: "",
        receiptDate: "",
        description: "",
        comments: "",
        storageLocation: "",
        receivedLocation: "",
        building: "",
        staff: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Package Data:", formData);
        onClose();
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
                <input type="text" name="trackingNumber" placeholder="Tracking Number" className="border p-2 rounded" onChange={handleChange} required />
                <input type="text" name="recipient" placeholder="Recipient ID" className="border p-2 rounded" onChange={handleChange} required />
                <input type="text" name="parcelType" placeholder="Parcel Type" className="border p-2 rounded" onChange={handleChange} required />
                <input type="text" name="shippingType" placeholder="Shipping Type" className="border p-2 rounded" onChange={handleChange} required />
                <input type="email" name="emailReceiptFrom" placeholder="Email Receipt From" className="border p-2 rounded" onChange={handleChange} required />
                <input type="text" name="mailRoom" placeholder="Mail Room" className="border p-2 rounded" onChange={handleChange} required />
                <input type="date" name="receiptDate" className="border p-2 rounded" onChange={handleChange} required />
                <input type="text" name="building" placeholder="Building" className="border p-2 rounded" onChange={handleChange} required />
                <input type="text" name="staff" placeholder="Staff ID" className="border p-2 rounded" onChange={handleChange} required />
                <textarea name="description" placeholder="Description" className="border p-2 rounded col-span-2" onChange={handleChange}></textarea>
                <textarea name="comments" placeholder="Comments" className="border p-2 rounded col-span-2" onChange={handleChange}></textarea>
                <input type="text" name="storageLocation" placeholder="Storage Location" className="border p-2 rounded" onChange={handleChange} />
                <input type="text" name="receivedLocation" placeholder="Received Location" className="border p-2 rounded" onChange={handleChange} />
                <div className="col-span-2 flex justify-end gap-2">
                    <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition">Cancel</button>
                    <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">Save Package</button>
                </div>
            </form>
        </motion.div>
    );
}