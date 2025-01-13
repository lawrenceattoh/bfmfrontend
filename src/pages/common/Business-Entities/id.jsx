import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { makeRequest } from "../../../api/apiClient";
import { FaLock, FaUnlock } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import moment from "moment/moment";
import { Briefcase, Paperclip, Note, Gear } from "phosphor-react"; // Import icons from Phosphor React
import { FloppyDiskBack, X, TrashSimple } from "phosphor-react"; // Import Phosphor icons

const BusinessEntitiesDetailPage = () => {
  const { BusinessEntitiesId } = useParams();

  const [businessEntity, setBusinessEntity] = useState(null);
  const [originalEntity, setOriginalEntity] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false); // Separate state for Add Note modal
  const [isAddDealModalOpen, setIsAddDealModalOpen] = useState(false); // Separate state for Add Deal modal
  const [loading, setLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(true);
  const [activeTab, setActiveTab] = useState("Details");

  const itemsPerPageOptions = [5, 10, 15, 20]; // Dropdown options for items per page

  const [deals, setDeals] = useState([]);
  const [newDeal, setNewDeal] = useState([]);
  const [totalDeals, setTotalDeals] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const nodeLabel = businessEntity?.name || "";

  const [attachments, setAttachments] = useState([]);

  const navigate = useNavigate();

  // Fetch attachments
  const fetchAttachments = async () => {
    try {
      const { data } = await makeRequest(
        "GET",
        `/attachments/?entityId=${businessEntity.id}`
      );
      if (data.attachments && data.attachments.length > 0) {
        setAttachments(data.attachments);
      } else {
        setAttachments([]); // Clear existing attachments if no data is returned
      }
    } catch {
      setAttachments([]); // Set attachments to an empty array in case of an error
    }
  };

  // Call `fetchAttachments` when the "Attachments" tab is clicked
  useEffect(() => {
    if (activeTab === "Attachments") {
      fetchAttachments();
    }
  }, [activeTab]);

  const handleViewAttachment = (attachment) => {
    const fileUrl = attachment.fileUrl;
    const fileType = attachment.fileType.toLowerCase();

    if (fileType.startsWith("image")) {
      // Open image in a new tab
      window.open(fileUrl, "_blank");
    } else if (fileType === "pdf") {
      // Open PDF in a new tab
      window.open(fileUrl, "_blank");
    } else {
      toast.error("File preview is not supported for this file type.");
    }
  };

  const tabItems = [
    { name: "Deals", icon: <Briefcase size={20} weight="duotone" /> },
    { name: "Attachments", icon: <Paperclip size={20} weight="duotone" /> },
    { name: "Notes", icon: <Note size={20} weight="duotone" /> },
    { name: "Metadata", icon: <Gear size={20} weight="duotone" /> },
  ];

  const handleDownloadAttachment = (attachment) => {
    const link = document.createElement("a");
    link.href = attachment.fileUrl;
    link.download = attachment.fileName;
    link.click();
  };

  // Fetch notes
  const fetchNotes = async () => {
    try {
      const { data } = await makeRequest("GET", `/notes`, {
        entityId: BusinessEntitiesId,
        nodeLabel,
      });
      setNotes(data.notes);
    } catch {
      toast.error("Failed to fetch notes.");
    }
  };

  // Fetch deals
  // Fetch deals with pagination and limit
  const fetchDeals = async () => {
    try {
      const offset = (currentPage - 1) * itemsPerPage;
      const { data } = await makeRequest(
        "GET",
        `/deals/?limit=${itemsPerPage}&offset=${offset}&businessEntityId=${BusinessEntitiesId}&order=asc`
      );
      setDeals(data.deals || []);
      setTotalDeals(data.rowCount || 0);
    } catch {
      toast.error("Failed to fetch deals.");
    }
  };

  // Call fetchDeals whenever page or items per page change
  useEffect(() => {
    fetchDeals();
  }, [currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to the first page when items per page changes
  };

  const totalPages = Math.ceil(totalDeals / itemsPerPage);

  // Fetch business entity details
  useEffect(() => {
    const fetchBusinessEntityDetails = async () => {
      try {
        const { data } = await makeRequest(
          "GET",
          `/business-entities/${BusinessEntitiesId}`
        );

        console.log("Business entity details: ", data);

        setBusinessEntity(data);
        setOriginalEntity(data);
      } catch {
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
      const { data } = await makeRequest(
        "PATCH",
        `/business-entities/${BusinessEntitiesId}`,
        {},
        { name: businessEntity.name }
      );
      setOriginalEntity(data);
      setBusinessEntity(data);
      setIsLocked(true);
      toast.success("Changes saved successfully!");
    } catch {
      toast.error("Failed to save changes.");
    }
  };

  const cancelChanges = () => {
    setBusinessEntity(originalEntity);
    setIsLocked(true);
  };

  const addNote = async () => {
    const payload = {
      note: newNote,
      node_label: businessEntity.name,
      entity_id: businessEntity.id,
    };

    try {
      const { data } = await makeRequest("POST", `/notes/`, {}, payload);
      if (data) {
        toast.success("Note added successfully!");
        fetchNotes();
        setIsAddNoteModalOpen(false); // Close the Add Note modal
        setNewNote("");
      } else {
        toast.error("Failed to add note.");
      }
    } catch (error) {
      console.error("Error adding note:", error);
      toast.error("An error occurred while adding the note.");
    }
  };

  const addDeal = async () => {
    const payload = {
      business_entity_id: businessEntity.id,
      business_group_id: businessEntity.id,
      name: newDeal.name,
      completed_date: newDeal.completed_date,
    };

    try {
      const { data } = await makeRequest("POST", `/deals/`, {}, payload);
      if (data) {
        toast.success("Deal added successfully!");
        fetchDeals();
        setIsAddDealModalOpen(false); // Close the Add Deal modal
        setNewDeal({ name: "", completed_date: "" });
      }
    } catch (error) {
      console.error("Error adding deal:", error);
      toast.error("An error occurred while adding the deal.");
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);

    if (tab === "Notes") {
      fetchNotes();
    } else if (tab === "Deals") {
      fetchDeals();
    }
  };

  const renderTabContent = () => {
    if (activeTab === "Notes") {
      return (
        <div>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setIsAddNoteModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
            >
              Add Note
            </button>
          </div>
          <table className="w-full bg-[#1E1E1E] text-white rounded-lg shadow-lg border border-gray-500 p-6 mt-4">
            <thead>
              <tr>
                <th className="text-left px-4 py-2">Note</th>
                {/* <th className="text-left px-4 py-2">Created By</th>
                <th className="text-left px-4 py-2">Created At</th> */}
              </tr>
            </thead>
            <tbody>
              {notes.map((note, index) => (
                <tr key={index}>
                  <td className="px-4 py-2">{note.note}</td>
                  {/* <td className="px-4 py-2">{note.created_by}</td>
                  <td className="px-4 py-2">
                    {new Date(note.created_at).toLocaleString()}
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else if (activeTab === "Deals") {
      return (
        <div className="deals-tab">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Deals</h2>
            <div className="flex items-center space-x-4">
              <label htmlFor="itemsPerPage" className="text-sm text-gray-400">
                Items per Page:
              </label>
              <select
                id="itemsPerPage"
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="bg-[#1E1E1E] text-white rounded-lg shadow-lg border border-gray-500 p-2"
              >
                {itemsPerPageOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setIsAddDealModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
              >
                Create New Deal
              </button>
            </div>
          </div>

          <div className="deals-list">
            {deals.length === 0 ? (
              <p className="text-center text-gray-400">No deals found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {deals.map((deal) => (
                  <div
                    key={deal.id}
                    className="deal-item p-4 bg-[#1E1E1E] text-white rounded-lg shadow-lg border border-gray-500 flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="text-white font-bold">{deal.name}</h3>
                      <p className="text-gray-400">
                        Completed On:{" "}
                        {new Date(deal.completed_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <button className="mt-2 px-3 py-1 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition duration-300">
                        {deal.id}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pagination flex justify-between items-center mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded ${
                currentPage === 1
                  ? "bg-gray-600 text-gray-400"
                  : "bg-blue-600 text-white"
              }`}
            >
              Previous
            </button>
            <span className="text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded ${
                currentPage === totalPages
                  ? "bg-gray-600 text-gray-400"
                  : "bg-blue-600 text-white"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      );
    } else if (activeTab === "Attachments") {
      return (
        <div>
          <div className="flex justify-end mb-4">
            <button
              onClick={() =>
                navigate(
                  `/BE/${businessEntity.id}/${businessEntity.name}/attachments/manage`
                )
              }
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
            >
              Manage Attachments
            </button>
          </div>
          {attachments.length === 0 ? (
            <p className="text-center text-gray-400">
              No attachments found for this business entity.
            </p>
          ) : (
            <table className="w-full bg-gray-800 text-gray-400 mt-4">
              <thead>
                <tr>
                  <th className="text-left px-4 py-2">File Name</th>
                  <th className="text-left px-4 py-2">Attachment Type</th>
                  <th className="text-left px-4 py-2">Uploaded By</th>
                  <th className="text-left px-4 py-2">Uploaded At</th>
                  <th className="text-left px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {attachments.map((attachment, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2">{attachment.fileName}</td>
                    <td className="px-4 py-2">{attachment.attachmentType}</td>
                    <td className="px-4 py-2">{attachment.uploadedBy}</td>
                    <td className="px-4 py-2">
                      {new Date(attachment.uploadedAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 flex space-x-2">
                      <button
                        className="text-blue-500 hover:underline"
                        onClick={() => handleViewAttachment(attachment)}
                      >
                        View
                      </button>
                      <button
                        className="text-blue-500 hover:underline"
                        onClick={() => handleDownloadAttachment(attachment)}
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      );
    } else if (activeTab === "Metadata") {
      return (
        <div className="bg-[#1E1E1E] text-white rounded-lg shadow-lg border border-gray-500 p-6 mt-8">
          <h2 className="text-lg font-semibold mb-4 text-white">Metadata</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Create Method */}
            <div className="flex flex-col">
              <label className="text-gray-400 text-sm mb-1">
                Create Method
              </label>
              <div className="bg-[#1E1E1E] text-white rounded-lg shadow-lg border border-gray-500 p-2">
                {businessEntity?.create_method || "N/A"}
              </div>
            </div>

            {/* Created By */}
            <div className="flex flex-col">
              <label className="text-gray-400 text-sm mb-1">Created By</label>
              <div className="bg-[#1E1E1E] text-white rounded-lg shadow-lg border border-gray-500 p-2">
                {businessEntity?.created_by || "N/A"}
              </div>
            </div>

            {/* Created At */}
            <div className="flex flex-col">
              <label className="text-gray-400 text-sm mb-1">Created At</label>
              <div className="bg-[#1E1E1E] text-white rounded-lg shadow-lg border border-gray-500 p-2">
                {businessEntity?.created_at
                  ? moment(businessEntity.created_at).format(
                      "MMMM Do YYYY, h:mm A"
                    )
                  : "N/A"}
              </div>
            </div>

            {/* Updated By */}
            <div className="flex flex-col">
              <label className="text-gray-400 text-sm mb-1">Updated By</label>
              <div className="bg-[#1E1E1E] text-white rounded-lg shadow-lg border border-gray-500 p-2">
                {businessEntity?.updated_by || "N/A"}
              </div>
            </div>

            {/* Updated At */}
            <div className="flex flex-col">
              <label className="text-gray-400 text-sm mb-1">Updated At</label>
              <div className="bg-[#1E1E1E] text-white rounded-lg shadow-lg border border-gray-500 p-2">
                {businessEntity?.updated_at
                  ? moment(businessEntity.updated_at).format(
                      "MMMM Do YYYY, h:mm A"
                    )
                  : "N/A"}
              </div>
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

  if (!businessEntity) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#121212] text-white">
        <p className="text-red-500">Business entity not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white py-10 px-20 w-full">
   <div className="flex items-center justify-between mb-8">
  <h1 className="text-3xl font-bold">
    <input
      type="text"
      value={businessEntity.name}
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
    <label className="block text-gray-400 text-sm mb-2">
      Business Group ID
    </label>
    <input
      type="text"
      value={businessEntity.id}
      disabled
      className="w-full bg-[#1E1E1E] text-white rounded-lg shadow-lg border border-gray-500 p-2 focus:outline-none"
    />
  </div>
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
        {/* Tabs with Phosphor Icons */}
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

      {/* Add Note Modal */}
      {isAddNoteModalOpen && (
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
                onClick={() => setIsAddNoteModalOpen(false)}
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

      {/* Add Deal Modal */}
      {isAddDealModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-[#1E1E1E] text-white rounded-lg shadow-lg border border-gray-500 p-6 w-1/3">
            <h2 className="text-xl font-bold text-white mb-4">Add Deal</h2>
            <input
              type="text"
              value={newDeal.name}
              onChange={(e) => setNewDeal({ ...newDeal, name: e.target.value })}
              className="w-full bg-[#1E1E1E] text-white rounded-lg shadow-lg border border-gray-500 p-2 focus:outline-none mb-4"
              placeholder="Deal Name"
            />
            <input
              type="date"
              value={newDeal.completed_date}
              onChange={(e) =>
                setNewDeal({ ...newDeal, completed_date: e.target.value })
              }
              className="w-full bg-[#1E1E1E] text-white rounded-lg shadow-lg border border-gray-500 p-2 focus:outline-none"
            />
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => setIsAddDealModalOpen(false)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
              >
                Cancel
              </button>
              <button
                onClick={addDeal}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {isAddDealModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-[#1E1E1E] text-white rounded-lg shadow-lg border border-gray-500 p-6 w-1/3">
            <h2 className="text-xl font-bold text-white mb-4">Add New Deal</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addDeal();
              }}
            >
              <div className="mb-4">
                <label htmlFor="dealName" className="block text-gray-400 mb-2">
                  Deal Name
                </label>
                <input
                  id="dealName"
                  type="text"
                  value={newDeal.name}
                  onChange={(e) =>
                    setNewDeal({ ...newDeal, name: e.target.value })
                  }
                  className="w-full bg-[#1E1E1E] text-white rounded-lg shadow-lg border border-gray-500 p-2 focus:outline-none"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="completedDate"
                  className="block text-gray-400 mb-2"
                >
                  Completed Date
                </label>
                <input
                  id="completedDate"
                  type="date"
                  value={newDeal.completed_date}
                  onChange={(e) =>
                    setNewDeal({ ...newDeal, completed_date: e.target.value })
                  }
                  className="w-full bg-[#1E1E1E] text-white rounded-lg shadow-lg border border-gray-500 p-2 focus:outline-none"
                  required
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsAddDealModalOpen(false)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default BusinessEntitiesDetailPage;
