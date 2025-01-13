import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { makeRequest } from "../../../api/apiClient";
import { FaLock, FaUnlock } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment/moment";
import { Briefcase, Paperclip, Note, Gear } from "phosphor-react"; // Import icons from Phosphor React
import { FloppyDiskBack, X, TrashSimple } from "phosphor-react"; // Import Phosphor icons

const WriterDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [writer, setWriter] = useState(null);
  const [originalWriter, setOriginalWriter] = useState(null);
  const [isLocked, setIsLocked] = useState(true);
  const [activeTab, setActiveTab] = useState("Works");
  const [works, setWorks] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [newWork, setNewWork] = useState({ name: "", status: "" });
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalWorks, setTotalWorks] = useState(0);
  const [isAddWorkModalOpen, setIsAddWorkModalOpen] = useState(false);
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);

  const itemsPerPageOptions = [5, 10, 15, 20];

  useEffect(() => {
    const fetchWriterDetails = async () => {
      try {
        const { data } = await makeRequest("GET", `/writers/${id}`);
        setWriter(data);
        setOriginalWriter(data);
      } catch {
        toast.error("Failed to fetch writer details.");
      }
    };

    fetchWriterDetails();
  }, [id]);

  const tabItems = [
    { name: "Works", icon: <Briefcase size={20} weight="duotone" /> },
    { name: "Attachments", icon: <Paperclip size={20} weight="duotone" /> },
    { name: "Notes", icon: <Note size={20} weight="duotone" /> },
    { name: "Metadata", icon: <Gear size={20} weight="duotone" /> },
  ];

  const handleTabClick = (tab) => {
    setActiveTab(tab);

    if (tab === "Notes") {
      fetchNotes();
    } else if (tab === "Works") {
      fetchWorks();
    }
  };

  const fetchWorks = async () => {
    try {
      const offset = (currentPage - 1) * itemsPerPage;
      const { data } = await makeRequest(
        "GET",
        `/writers/${id}/works?limit=${itemsPerPage}&offset=${offset}`
      );
      setWorks(data.works || []);
      setTotalWorks(data.rowCount || 0);
    } catch {
      toast.error("Failed to fetch works.");
    }
  };

  const fetchAttachments = async () => {
    try {
      const { data } = await makeRequest("GET", `/attachments/?writerId=${id}`);
      setAttachments(data.attachments || []);
    } catch {
      toast.error("Failed to fetch attachments.");
    }
  };

  const fetchNotes = async () => {
    try {
      const { data } = await makeRequest("GET", `/notes?entityId=${id}`);
      setNotes(data.notes || []);
    } catch {
      toast.error("Failed to fetch notes.");
    }
  };

  useEffect(() => {
    if (activeTab === "Works") fetchWorks();
    if (activeTab === "Attachments") fetchAttachments();
    if (activeTab === "Notes") fetchNotes();
  }, [activeTab, currentPage, itemsPerPage]);

  const toggleLock = () => setIsLocked((prev) => !prev);

  const handleFieldChange = (field, value) => {
    setWriter((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const saveChanges = async () => {
    try {
      const { data } = await makeRequest("PATCH", `/writers/${id}`, {}, writer);
      setOriginalWriter(data);
      setWriter(data);
      setIsLocked(true);
      toast.success("Changes saved successfully!");
    } catch {
      toast.error("Failed to save changes.");
    }
  };

  const cancelChanges = () => {
    setWriter(originalWriter);
    setIsLocked(true);
  };

  const addWork = async () => {
    const payload = { writer_id: id, ...newWork };
    try {
      await makeRequest("POST", `/writers/${id}/works`, {}, payload);
      fetchWorks();
      setIsAddWorkModalOpen(false);
      setNewWork({ name: "", status: "" });
      toast.success("Work added successfully!");
    } catch {
      toast.error("Failed to add work.");
    }
  };

  const addNote = async () => {
    const payload = { writer_id: id, note: newNote };
    try {
      await makeRequest("POST", `/notes`, {}, payload);
      fetchNotes();
      setIsAddNoteModalOpen(false);
      setNewNote("");
      toast.success("Note added successfully!");
    } catch {
      toast.error("Failed to add note.");
    }
  };

  const renderTabContent = () => {
    if (activeTab === "Works") {
      return (
        <div className="works-tab">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Works</h2>
            <div className="flex items-center space-x-4">
              <label htmlFor="itemsPerPage" className="text-sm text-gray-400">
                Items per Page:
              </label>
              <select
                id="itemsPerPage"
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="bg-[#1E1E1E] text-white rounded-lg shadow-lg border border-gray-500 p-2"
              >
                {itemsPerPageOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setIsAddWorkModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
              >
                Create New Work
              </button>
            </div>
          </div>

          <div className="works-list">
            {works.length === 0 ? (
              <p className="text-center text-gray-400">No works found.</p>
            ) : (
              <table className="w-full bg-gray-800 text-gray-400 mt-4">
                <thead>
                  <tr>
                    <th className="px-4 py-2">ID</th>
                    <th className="px-4 py-2">Title</th>
                    <th className="px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {works.map((work) => (
                    <tr key={work.id}>
                      <td className="px-4 py-2">{work.id}</td>
                      <td className="px-4 py-2">{work.name}</td>
                      <td className="px-4 py-2">{work.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="pagination flex justify-between items-center mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {Math.ceil(totalWorks / itemsPerPage)}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + 1, Math.ceil(totalWorks / itemsPerPage))
                )
              }
              disabled={currentPage === Math.ceil(totalWorks / itemsPerPage)}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Next
            </button>
          </div>
        </div>
      );
    } else if (activeTab === "Notes") {
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
    }

    else if (activeTab === "Attachments") {
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
                    {writer?.create_method || "N/A"}
                  </div>
                </div>
    
                {/* Created By */}
                <div className="flex flex-col">
                  <label className="text-gray-400 text-sm mb-1">Created By</label>
                  <div className="bg-[#1E1E1E] text-white rounded-lg shadow-lg border border-gray-500 p-2">
                    {writer?.created_by || "N/A"}
                  </div>
                </div>
    
                {/* Created At */}
                <div className="flex flex-col">
                  <label className="text-gray-400 text-sm mb-1">Created At</label>
                  <div className="bg-[#1E1E1E] text-white rounded-lg shadow-lg border border-gray-500 p-2">
                    {writer?.created_at
                      ? moment(writer.created_at).format(
                          "MMMM Do YYYY, h:mm A"
                        )
                      : "N/A"}
                  </div>
                </div>
    
                {/* Updated By */}
                <div className="flex flex-col">
                  <label className="text-gray-400 text-sm mb-1">Updated By</label>
                  <div className="bg-[#1E1E1E] text-white rounded-lg shadow-lg border border-gray-500 p-2">
                    {writer?.updated_by || "N/A"}
                  </div>
                </div>
    
                {/* Updated At */}
                <div className="flex flex-col">
                  <label className="text-gray-400 text-sm mb-1">Updated At</label>
                  <div className="bg-[#1E1E1E] text-white rounded-lg shadow-lg border border-gray-500 p-2">
                    {writer?.updated_at
                      ? moment(writer.updated_at).format(
                          "MMMM Do YYYY, h:mm A"
                        )
                      : "N/A"}
                  </div>
                </div>
              </div>
            </div>
          );
        }

    return null;
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white py-10 px-20 w-full">
      <div className="flex items-center justify-between mb-8">
  <h1 className="text-3xl font-bold">
    <input
      type="text"
      value={writer?.name || ""}
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
          <label className="block text-gray-400 text-sm mb-2">Writer ID</label>
          <input
            type="text"
            value={writer?.id || ""}
            disabled
            className="w-full bg-[#1E1E1E] text-white rounded-lg shadow-lg border border-gray-500 p-2 focus:outline-none"
          />
        </div>
        {/* <div>
          <label className="block text-gray-400 text-sm mb-2">
            Writer Name
          </label>
          <input
            type="text"
            value={writer?.name || ""}
            disabled={isLocked}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            className={`w-full ${
              isLocked ? "bg-[#1E1E1E]" : "bg-gray-800"
            } text-white rounded-lg shadow-lg border border-gray-500 p-2 focus:outline-none`}
          />
        </div> */}
        <div>
          <label className="block text-gray-400 text-sm mb-2">IPI</label>
          <input
            type="text"
            value={writer?.ipi || ""}
            disabled={isLocked}
            onChange={(e) => handleFieldChange("ipi", e.target.value)}
            className={`w-full ${
              isLocked ? "bg-[#1E1E1E]" : "bg-gray-800"
            } text-white rounded-lg shadow-lg border border-gray-500 p-2 focus:outline-none`}
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

      {isAddWorkModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-[#1E1E1E] text-white rounded-lg shadow-lg border border-gray-500 p-6 w-1/3">
            <h2 className="text-xl font-bold text-white mb-4">Add Work</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addWork();
              }}
            >
              <div className="mb-4">
                <label htmlFor="workName" className="block text-gray-400 mb-2">
                  Work Name
                </label>
                <input
                  id="workName"
                  type="text"
                  value={newWork.name}
                  onChange={(e) =>
                    setNewWork((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full bg-[#1E1E1E] text-white rounded-lg shadow-lg border border-gray-500 p-2 focus:outline-none"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="workStatus"
                  className="block text-gray-400 mb-2"
                >
                  Status
                </label>
                <input
                  id="workStatus"
                  type="text"
                  value={newWork.status}
                  onChange={(e) =>
                    setNewWork((prev) => ({ ...prev, status: e.target.value }))
                  }
                  className="w-full bg-[#1E1E1E] text-white rounded-lg shadow-lg border border-gray-500 p-2 focus:outline-none"
                  required
                />
              </div>
              <div className="flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  onClick={() => setIsAddWorkModalOpen(false)}
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

export default WriterDetailPage;
