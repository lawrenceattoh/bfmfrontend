import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { makeRequest } from "../../../api/apiClient";
import { FaLock, FaUnlock } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BusinessEntitiesDetailPage = () => {
  const { BusinessEntitiesId } = useParams();

  const [businessEntity, setBusinessEntity] = useState(null); // Current state
  const [originalEntity, setOriginalEntity] = useState(null); // To hold original data
  const [loading, setLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(true);
  const [activeTab, setActiveTab] = useState("Details");

  useEffect(() => {
    const fetchBusinessEntityDetails = async () => {
      console.log("Fetching business entity details on ID: " + BusinessEntitiesId);

      const { data, error } = await makeRequest(
        "GET",
        `/business-entities/${BusinessEntitiesId}`
      );
      if (data) {
        setBusinessEntity(data);
        setOriginalEntity(data); // Store the original data
      } else {
        toast.error("Failed to fetch business entity details.");
      }
      setLoading(false);
    };
    fetchBusinessEntityDetails();
  }, [BusinessEntitiesId]);

  const toggleLock = () => {
    setIsLocked((prev) => !prev);
  };

  const handleFieldChange = (field, value) => {
    setBusinessEntity((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const saveChanges = async () => {
    try {
      const { data, error } = await makeRequest(
        "PATCH", // PATCH method as specified
        `/business-entities/${BusinessEntitiesId}`,
        {},
        { name: businessEntity.name } // Only send the `name` field
      );
      if (error) {
        toast.error("Failed to save changes.");
      } else {
        toast.success("Changes saved successfully!");
        setOriginalEntity(data); // Update original data with the response
        setBusinessEntity(data); // Update current state with the response
        setIsLocked(true); // Lock fields after saving
      }
    } catch (error) {
      console.error("Error saving changes:", error);
      toast.error("An error occurred while saving changes.");
    }
  };

  const cancelChanges = () => {
    setBusinessEntity(originalEntity); // Revert changes to the original state
    setIsLocked(true); // Lock fields on cancel
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
        <p>Loading...</p>
      </div>
    );
  }

  if (!businessEntity) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
        <p className="text-red-500">Business entity not found.</p>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "Deals":
        return <p>This is where Deals is</p>;
      case "Attachments":
        return <p>This is where Attachments is</p>;
      case "Notes":
        return (
          <table className="w-full bg-gray-800 text-gray-400 mt-4">
            <thead>
              <tr>
                <th className="text-left px-4 py-2">Note</th>
                <th className="text-left px-4 py-2">Created By</th>
                <th className="text-left px-4 py-2">Created At</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2">Uploaded some files</td>
                <td className="px-4 py-2">admin</td>
                <td className="px-4 py-2">27/11/2024, 15:20:56</td>
              </tr>
              <tr>
                <td className="px-4 py-2">Created business entity</td>
                <td className="px-4 py-2">tristan@bellafiguramusic.com</td>
                <td className="px-4 py-2">28/11/2024, 14:35:50</td>
              </tr>
            </tbody>
          </table>
        );
      case "Metadata":
        return <p>This is where Metadata is</p>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-20 w-full">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Business Entity</h1>
        <button
          onClick={toggleLock}
          className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full"
          title={isLocked ? "Unlock Fields" : "Lock Fields"}
        >
          {isLocked ? <FaLock size={20} /> : <FaUnlock size={20} />}
        </button>
      </div>

      {/* Business Entity Fields */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-md grid grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-400 text-sm mb-2">Business Group ID</label>
          <input
            type="text"
            value={businessEntity.id}
            disabled
            className="w-full bg-gray-700 text-white p-2 rounded focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-2">Name</label>
          <input
            type="text"
            value={businessEntity.name}
            disabled={isLocked}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            className={`w-full ${
              isLocked ? "bg-gray-700" : "bg-gray-600"
            } text-white p-2 rounded focus:outline-none`}
          />
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-2">Created By</label>
          <input
            type="text"
            value={businessEntity.created_by}
            disabled
            className="w-full bg-gray-700 text-white p-2 rounded focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-gray-400 text-sm mb-2">Created At</label>
          <input
            type="text"
            value={new Date(businessEntity.created_at).toLocaleString()}
            disabled
            className="w-full bg-gray-700 text-white p-2 rounded focus:outline-none"
          />
        </div>
        {!isLocked && (
          <div className="col-span-2 flex justify-end gap-4 mt-4">
            <button
              onClick={cancelChanges}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
            >
              Cancel
            </button>
            <button
              onClick={saveChanges}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Tabs Section */}
      <div className="mt-8">
        <div className="flex space-x-6 border-b border-gray-700">
          {["Deals", "Attachments", "Notes", "Metadata"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 ${
                activeTab === tab
                  ? "border-b-2 border-blue-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="mt-6">{renderTabContent()}</div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default BusinessEntitiesDetailPage;
