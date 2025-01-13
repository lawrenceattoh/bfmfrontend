import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { makeRequest } from "../../../api/apiClient";
import { FaLock, FaUnlock } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import moment from "moment";
import { Briefcase, Paperclip, Note, Gear, Info, Package } from "phosphor-react"; // Import Phosphor Icons
import { FloppyDiskBack, X, TrashSimple } from "phosphor-react"; // Import Phosphor icons

const DealDetailPage = () => {
  const { dealId } = useParams();

  const [deal, setDeal] = useState(null);
  const [originalDeal, setOriginalDeal] = useState(null);
  const [notes, setNotes] = useState([]); // State for notes
  const [newNote, setNewNote] = useState(""); // State for new note input
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [loading, setLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(true);
  const [activeTab, setActiveTab] = useState("Assets");

  // Fetch notes
  const fetchNotes = async () => {
    try {
      const { data } = await makeRequest("GET", `/notes`, {
        entityId: dealId,
        nodeLabel: deal?.name || "",
      });
      setNotes(data.notes);
    } catch {
      toast.error("Failed to fetch notes.");
    }
  };

  // Fetch deal details
  useEffect(() => {
    const fetchDealDetails = async () => {
      try {
        const { data } = await makeRequest("GET", `/deals/${dealId}`);
        setDeal(data);
        setOriginalDeal(data);
      } catch {
        toast.error("Failed to fetch deal details.");
      }
      setLoading(false);
    };

    fetchDealDetails();
  }, [dealId]);

  const toggleLock = () => {
    setIsLocked((prev) => !prev);
  };

  const handleFieldChange = (field, value) => {
    setDeal((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const saveChanges = async () => {
    try {
      const payload = {
        business_entity_id: deal?.business_entity_id,
        name: deal.name,
        completed_date: deal.completed_date,
      };
      const { data } = await makeRequest("PATCH", `/deals/${dealId}`, {}, payload);
      setOriginalDeal(data);
      setDeal(data);
      setIsLocked(true);
      toast.success("Changes saved successfully!");
    } catch {
      toast.error("Failed to save changes.");
    }
  };

  const cancelChanges = () => {
    setDeal(originalDeal);
    setIsLocked(true);
  };

  const addNote = async () => {
    const payload = {
      note: newNote,
      node_label: deal.name,
      entity_id: deal.id,
    };

    try {
      const { data } = await makeRequest("POST", `/notes/`, {}, payload);
      if (data) {
        toast.success("Note added successfully!");
        fetchNotes(); // Refresh the notes data
        setIsModalOpen(false); // Close the modal
        setNewNote(""); // Clear the input field
      }
    } catch {
      toast.error("An error occurred while adding the note.");
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);

    if (tab === "Notes") {
      fetchNotes(); // Load notes when Notes tab is clicked
    }
  };

  const tabItems = [
    { name: "Assets", icon: <Package size={20} weight="duotone" /> },
    { name: "Attachments", icon: <Paperclip size={20} weight="duotone" /> },
    { name: "Notes", icon: <Note size={20} weight="duotone" /> },
    { name: "Metadata", icon: <Gear size={20} weight="duotone" /> },
  ];

  const renderTabContent = () => {
    // if (activeTab === "Notes") {
    //   return (
    //     <div>
    //       <div className="flex justify-end mb-4">
    //         <button
    //           onClick={() => setIsModalOpen(true)}
    //           className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
    //         >
    //           Add Note
    //         </button>
    //       </div>
    //       <table className="w-full bg-gray-800 text-gray-400 mt-4">
    //         <thead>
    //           <tr>
    //             <th className="text-left px-4 py-2">Note</th>
    //             {/* <th className="text-left px-4 py-2">Created By</th>
    //             <th className="text-left px-4 py-2">Created At</th> */}
    //           </tr>
    //         </thead>
    //         <tbody>
    //           {notes.map((note, index) => (
    //             <tr key={index}>
    //               <td className="px-4 py-2">{note.note}</td>
    //               {/* <td className="px-4 py-2">{note.created_by}</td>
    //               <td className="px-4 py-2">
    //                 {new Date(note.created_at).toLocaleString()}
    //               </td> */}
    //             </tr>
    //           ))}
    //         </tbody>
    //       </table>
    //     </div>
    //   );
    // }

    if (activeTab === "Metadata" && deal) {
      return (
        <div className="bg-[#1E1E1E] text-white rounded-lg shadow-lg border border-gray-500 p-6 mt-8">
          <h2 className="text-lg font-semibold mb-4 text-white">Metadata</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-gray-400 text-sm">Created By</label>
            <p className="bg-[#1E1E1E] text-white rounded-lg shadow-lg border border-gray-500 p-2">
              {deal.created_by}
            </p>
          </div>
          <div>
            <label className="text-gray-400 text-sm">Created At</label>
            <p className="bg-[#1E1E1E] text-white rounded-lg shadow-lg border border-gray-500 p-2">
              {moment(deal.created_at).format("MMMM Do YYYY, h:mm:ss a")}
            </p>
          </div>
          <div>
            <label className="text-gray-400 text-sm">Updated By</label>
            <p className="bg-[#1E1E1E] text-white rounded-lg shadow-lg border border-gray-500 p-2">
              {deal.updated_by}
            </p>
          </div>
          <div>
            <label className="text-gray-400 text-sm">Updated At</label>
            <p className="bg-[#1E1E1E] text-white rounded-lg shadow-lg border border-gray-500 p-2">
              {moment(deal.updated_at).format("MMMM Do YYYY, h:mm:ss a")}
            </p>
          </div>
        </div>
        </div>
      );
    }

    
    return <p>This is where {activeTab} content will go.</p>;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#121212] text-white">
        <p>Loading...</p>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#121212] text-white">
        <p className="text-red-500">Deal not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white py-10 px-20 w-full">
     <div className="flex items-center justify-between mb-8">
  <h1 className="text-3xl font-bold">
    <input
      type="text"
      value={deal.name}
      disabled={isLocked}
      onChange={(e) => handleFieldChange("name", e.target.value)}
      className={`w-full ${
        isLocked ? "bg-[#121212]" : "bg-gray-800"
      } text-white rounded-lg p-2 focus:outline-none`}
    />
  </h1>
  <button
    onClick={toggleLock}
    className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full"
    title={isLocked ? "Unlock Fields" : "Lock Fields"}
  >
    {isLocked ? <FaLock size={20} /> : <FaUnlock size={20} />}
  </button>
</div>


      <div className="bg-[#1E1E1E] text-white rounded-lg shadow-lg border border-gray-500 p-6 grid grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-400 text-sm mb-2">Deal ID</label>
          <input
            type="text"
            value={deal.id}
            disabled
            className="w-full bg-[#1E1E1E] text-white rounded-lg shadow-lg border border-gray-500 p-2 focus:outline-none"
          />
        </div>
        {/* <div>
          <label className="block text-gray-400 text-sm mb-2">Name</label>
          <input
            type="text"
            value={deal.name}
            disabled={isLocked}
            onChange={(e) => handleFieldChange("name", e.target.value)}
         className={`w-full ${
              isLocked ? "bg-[#1E1E1E]" : "bg-gray-800"
            } text-white rounded-lg shadow-lg border border-gray-500 p-2 focus:outline-none`}
          />
        </div> */}
        <div>
          <label className="block text-gray-400 text-sm mb-2">Completed Date</label>
          <input
            type="date"
            value={deal.completed_date}
            disabled={isLocked}
            onChange={(e) => handleFieldChange("completed_date", e.target.value)}
         className={`w-full ${
              isLocked ? "bg-[#1E1E1E]" : "bg-gray-800"
            } text-white rounded-lg shadow-lg border border-gray-500 p-2 focus:outline-none`}
          />
        </div>
        {/* <div>
          <label className="block text-gray-400 text-sm mb-2">Created By</label>
          <input
            type="text"
            value={deal.created_by}
            disabled
            className="w-full bg-[#1E1E1E] text-white rounded-lg shadow-lg border border-gray-500 p-2 focus:outline-none"
          />
        </div> */}
       {!isLocked && (
  <div className="col-span-2 flex justify-end gap-4 mt-4">
    <button
      onClick={cancelChanges}
      title="Cancel"
      className="p-2 bg-red-600 rounded-full hover:bg-red-500"
    >
      <TrashSimple size={20} color="#fff" />
    </button>
    <button
      onClick={saveChanges}
      title="Save Changes"
      className="p-2 bg-blue-600 rounded-full hover:bg-blue-500"
    >
      <FloppyDiskBack size={20} color="#fff" />
    </button>
  </div>
)}

      </div>

      <div className="mt-8">
         {/* Tabs */}
      <div className="flex space-x-6 border-b border-gray-700">
        {tabItems.map((tab) => (
          <button
            key={tab.name}
            onClick={() => handleTabClick(tab.name)}
            className={`pb-2 flex items-center space-x-2 ${
              activeTab === tab.name
                ? "border-b-2 border-blue-500 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {tab.icon}
            <span>{tab.name}</span>
          </button>
        ))}
      </div>
        <div className="mt-6">{renderTabContent()}</div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-[#1E1E1E] text-white rounded-lg shadow-lg border border-gray-500 p-6 w-1/3">
            <h2 className="text-xl font-bold text-white mb-4">Add Note</h2>
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="w-full bg-[#1E1E1E] text-white rounded-lg shadow-lg border border-gray-500 p-2 focus:outline-none"
              placeholder="Enter your note here"
            ></textarea>
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
              >
                Cancel
              </button>
              <button
                onClick={addNote}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default DealDetailPage;
