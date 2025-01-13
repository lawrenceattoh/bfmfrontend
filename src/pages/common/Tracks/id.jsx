import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { makeRequest } from "../../../api/apiClient";
import { FaLock, FaUnlock } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Briefcase, Note, Gear } from "phosphor-react"; // Import icons from Phosphor React
import moment from "moment";

const TracksDetailsPage = () => {
  const { trackId } = useParams();

  const [track, setTrack] = useState(null);
  const [originalTrack, setOriginalTrack] = useState(null);
  const [isLocked, setIsLocked] = useState(true);
  const [activeTab, setActiveTab] = useState("Details");
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);

  const fetchTrackDetails = async () => {
    try {
      const { data } = await makeRequest("GET", `/api/v1/tracks/${trackId}`);
      setTrack(data);
      setOriginalTrack(data);
    } catch {
      toast.error("Failed to fetch track details.");
    }
  };

  const fetchNotes = async () => {
    try {
      const { data } = await makeRequest(
        "GET",
        `/notes?entityId=${trackId}&nodeLabel=Track`
      );
      setNotes(data.notes || []);
    } catch {
      toast.error("Failed to fetch notes.");
    }
  };

  const toggleLock = () => setIsLocked((prev) => !prev);

  const handleFieldChange = (field, value) => {
    setTrack((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const saveChanges = async () => {
    try {
      const { data } = await makeRequest(
        "PATCH",
        `/api/v1/tracks/${trackId}`,
        {},
        track
      );
      setTrack(data);
      setOriginalTrack(data);
      setIsLocked(true);
      toast.success("Changes saved successfully!");
    } catch {
      toast.error("Failed to save changes.");
    }
  };

  const cancelChanges = () => {
    setTrack(originalTrack);
    setIsLocked(true);
  };

  const addNote = async () => {
    const payload = {
      note: newNote,
      node_label: "Track",
      entity_id: track.id,
    };

    try {
      await makeRequest("POST", `/notes/`, {}, payload);
      toast.success("Note added successfully!");
      setIsAddNoteModalOpen(false);
      setNewNote("");
      fetchNotes();
    } catch {
      toast.error("Failed to add note.");
    }
  };

  const renderTabContent = () => {
    if (activeTab === "Details") {
      return (
        <div className="bg-[#1E1E1E] text-white rounded-lg shadow-lg border border-gray-500 p-6 grid grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Track ID</label>
            <input
              type="text"
              value={track?.id || ""}
              disabled
              className="w-full bg-[#1E1E1E] text-white rounded-lg shadow-lg border border-gray-500 p-2"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Track Name</label>
            <input
              type="text"
              value={track?.name || ""}
              disabled={isLocked}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              className={`w-full ${
                isLocked ? "bg-[#1E1E1E]" : "bg-gray-800"
              } text-white rounded-lg shadow-lg border border-gray-500 p-2`}
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Artist Name</label>
            <input
              type="text"
              value={track?.artist_name || ""}
              disabled
              className="w-full bg-[#1E1E1E] text-white rounded-lg shadow-lg border border-gray-500 p-2"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Artist ID</label>
            <input
              type="text"
              value={track?.artist_id || ""}
              disabled
              className="w-full bg-[#1E1E1E] text-white rounded-lg shadow-lg border border-gray-500 p-2"
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
          <div className="bg-[#1E1E1E] text-white rounded-lg shadow-lg border border-gray-500 p-6 mt-4">
            {notes.length === 0 ? (
              <p className="text-center text-gray-400">No notes found.</p>
            ) : (
              <ul>
                {notes.map((note, index) => (
                  <li key={index} className="mb-2">
                    {note.note}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      );
    }
  };

  useEffect(() => {
    fetchTrackDetails();
  }, [trackId]);

  return (
    <div className="min-h-screen bg-[#121212] text-white py-10 px-20 w-full">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">{track?.name || ""}</h1>
        <button
          onClick={toggleLock}
          className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full"
          title={isLocked ? "Unlock Fields" : "Lock Fields"}
        >
          {isLocked ? <FaLock size={20} /> : <FaUnlock size={20} />}
        </button>
      </div>

      <div className="flex space-x-6 border-b border-gray-700">
        {["Details", "Notes"].map((tab) => (
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

      {isAddNoteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-[#1E1E1E] text-white rounded-lg shadow-lg border border-gray-500 p-6 w-1/3">
            <h2 className="text-xl font-bold text-white mb-4">Add Note</h2>
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="w-full bg-[#1E1E1E] text-white rounded-lg shadow-lg border border-gray-500 p-2"
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

      <ToastContainer />
    </div>
  );
};

export default TracksDetailsPage;
