import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { makeRequest } from "../../../api/apiClient";
import { ToastContainer, toast } from "react-toastify";

const ManageAttachmentsPage = () => {
  const { BusinessEntitiesId } = useParams();
  const { BusinessEntitiesName } = useParams();
  const [attachments, setAttachments] = useState([]);
  const [isAddAttachmentModalOpen, setIsAddAttachmentModalOpen] = useState(false);
  const [newFiles, setNewFiles] = useState([]);
  const [newAttachmentData, setNewAttachmentData] = useState({
    category: "",
    type: "Marketing", // Default type
    fileName: "",
    preview: null, // For file preview
  });
  const [loading, setLoading] = useState(true);

  // Fetch attachments for the business entity
  const fetchAttachments = async () => {
    try {
      const { data } = await makeRequest(
        "GET",
        `/attachments/?entityId=${BusinessEntitiesId}`
      );
      setAttachments(data.attachments || []);
      setLoading(false);
    } catch {
      setAttachments([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttachments();
  }, []);

  // Handle File Selection
  const handleFileSelection = (files) => {
    const file = files[0]; // Only handle the first file for simplicity
    if (file) {
      const fileType = file.type.startsWith("image") ? "Images" : "Documents";
      setNewAttachmentData((prev) => ({
        ...prev,
        category: fileType,
        fileName: file.name,
        preview: URL.createObjectURL(file), // Generate preview URL
      }));
    }
    setNewFiles(files);
  };

  // Upload Attachments
  const uploadAttachments = async () => {
    if (!newFiles.length) {
      toast.error("Please attach at least one file before uploading.");
      return;
    }
  
    // Ensure all arrays are synchronized in length
    const categories = Array(newFiles.length).fill(newAttachmentData.category);
    const types = Array(newFiles.length).fill(newAttachmentData.type);
    const filenames = Array.from(newFiles).map((file) => file.name);
  
    const formData = new FormData();
    formData.append("entity_id", BusinessEntitiesId); // Business Entity ID
    formData.append("node_label", BusinessEntitiesName); // Business Entity Name
    formData.append("categories", JSON.stringify(categories)); // Categories as JSON array
    formData.append("types", JSON.stringify(types)); // Types as JSON array
    formData.append("filenames", JSON.stringify(filenames)); // Filenames as JSON array
    Array.from(newFiles).forEach((file) => formData.append("files", file)); // Multiple files
  
    // Debugging: Log FormData content
    console.log("FormData for Upload:");
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
  
    try {
      const response = await makeRequest("POST", "/attachments/upload", {}, formData);
      console.log("Server Response:", response.data);
      toast.success("Attachments uploaded successfully.");
      setIsAddAttachmentModalOpen(false);
      fetchAttachments(); // Refresh the list
    } catch (error) {
      console.error("Upload Error:", error.response ? error.response.data : error);
      toast.error(error.response?.data?.detail || "Failed to upload attachments.");
    }
  };
  
  
  return (
    <div className="min-h-screen bg-[#121212] text-white py-10 px-20 w-full">
      <h1 className="text-2xl font-bold mb-6">Manage Attachments</h1>
      <button
        onClick={() => setIsAddAttachmentModalOpen(true)}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
      >
        Add Attachment
      </button>
      {loading ? (
        <p className="text-center text-gray-400">Loading attachments...</p>
      ) : attachments.length === 0 ? (
        <p className="text-center text-gray-400">No attachments found for this business entity.</p>
      ) : (
        <div>
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="bg-gray-800 p-4 rounded-lg shadow-md mb-4"
            >
              <div className="flex justify-between items-center">
                <p>{attachment.fileName}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Attachment Modal */}
      {isAddAttachmentModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-[#1E1E1E] text-white rounded-lg shadow-lg border border-gray-500 p-6 w-1/3">
            <h2 className="text-xl font-bold text-white mb-4">Add Attachment</h2>
            <input
              type="file"
              accept="image/*,.pdf,.doc,.docx,.txt" // Accept specific file types
              onChange={(e) => handleFileSelection(e.target.files)}
              className="w-full bg-[#1E1E1E] text-white rounded-lg shadow-lg border border-gray-500 p-2 focus:outline-none mb-4"
            />
            {newAttachmentData.preview && (
              <div className="mb-4">
                <img
                  src={newAttachmentData.preview}
                  alt="Preview"
                  className="w-full max-h-40 object-cover rounded"
                />
              </div>
            )}
            <input
              type="text"
              value={newAttachmentData.fileName || "Attach a file to get filename"}
              disabled
              className="w-full bg-[#1E1E1E] text-white rounded-lg shadow-lg border border-gray-500 p-2 focus:outline-none mb-4"
            />
            <select
              value={newAttachmentData.type}
              onChange={(e) => setNewAttachmentData((prev) => ({ ...prev, type: e.target.value }))}
              className="w-full bg-[#1E1E1E] text-white rounded-lg shadow-lg border border-gray-500 p-2 focus:outline-none mb-4"
            >
              <option value="Marketing">Marketing</option>
              <option value="Artwork">Artwork</option>
              <option value="Other">Other</option>
            </select>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsAddAttachmentModalOpen(false)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
              >
                Cancel
              </button>
              <button
                onClick={uploadAttachments}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default ManageAttachmentsPage;
