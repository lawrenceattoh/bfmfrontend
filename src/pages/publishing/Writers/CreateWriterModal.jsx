import React, { useState } from "react";
import { makeRequest } from "../../../api/apiClient";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateWriterModal = ({ onClose }) => {
    const [formData, setFormData] = useState({
        alias: "",
        name: "",
        ipi: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            const { data, error } = await makeRequest("POST", "/writers", {}, formData);
            if (!error) {
                toast.success("Writer created successfully!");
                onClose();
                window.location.reload(); // Refresh list after creation
            } else {
                toast.error("Failed to create writer.");
            }
        } catch (err) {
            console.error(err);
            toast.error("Error creating writer.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <ToastContainer />
            <div className="bg-[#121212] text-white p-6 rounded shadow-lg w-1/3">
                <h2 className="text-2xl font-bold mb-4">Create New Writer</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm">Alias</label>
                        <input
                            type="text"
                            name="alias"
                            value={formData.alias}
                            onChange={handleInputChange}
                            className="w-full bg-[#1E1E1E] border border-gray-600 text-white px-4 py-2 rounded focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full bg-[#1E1E1E] border border-gray-600 text-white px-4 py-2 rounded focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm">IPI</label>
                        <input
                            type="text"
                            name="ipi"
                            value={formData.ipi}
                            onChange={handleInputChange}
                            className="w-full bg-[#1E1E1E] border border-gray-600 text-white px-4 py-2 rounded focus:outline-none"
                        />
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button
                            onClick={onClose}
                            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-white"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
                        >
                            Create
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateWriterModal;
