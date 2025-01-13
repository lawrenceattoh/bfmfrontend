import React, { useState, useEffect } from "react";
import { makeRequest } from "../../../api/apiClient";
import { ToastContainer, toast } from "react-toastify";
import { Trash } from "phosphor-react"; // Import the trash icon from Phosphor
import "react-toastify/dist/ReactToastify.css";

const UserManagement = () => {
  const [email, setEmail] = useState("");
  const [accessLevel, setAccessLevel] = useState("Viewer");
  const [users, setUsers] = useState([]);
  const [originalUsers, setOriginalUsers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await makeRequest("GET", "/users");
      setUsers(data.users || []);
      setOriginalUsers(JSON.parse(JSON.stringify(data.users || []))); // Save original state
    } catch (err) {
      console.error(err);
      toast.error("Failed to load users.");
    }
  };

  const handleAddUser = async () => {
    if (!email) {
      toast.error("Please enter an email.");
      return;
    }

    try {
      const { error } = await makeRequest(
        "POST",
        "/users/",
        {},
        {
          uid: email.split("@")[0],
          email,
          access_level: accessLevel.toUpperCase(),
        }
      );

      if (!error) {
        toast.success("User added successfully!");
        fetchUsers();
        setEmail("");
        setAccessLevel("Viewer");
      } else {
        toast.error("Failed to add user.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error adding user.");
    }
  };

  const handleDeleteUser = async (userEmail) => {
    const confirmed = window.confirm(`Are you sure you want to delete ${userEmail}?`);
    if (!confirmed) return;

    try {
      const { error } = await makeRequest(
        "DELETE",
        "/users/",
        {},
        { email: userEmail }
      );

      if (!error) {
        toast.success("User deleted successfully!");
        fetchUsers();
      } else {
        toast.error("Failed to delete user.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting user.");
    }
  };

  const handleSaveChanges = async () => {
    const updatedUsers = users.filter((user, index) => {
      return user.access_level !== originalUsers[index].access_level;
    });

    if (updatedUsers.length === 0) {
      toast.info("No changes to save.");
      return;
    }

    try {
      const { error } = await makeRequest(
        "PATCH",
        "/users/",
        {},
        {
          users: updatedUsers.map((user) => ({
            uid: user.uid,
            email: user.email,
            access_level: user.access_level.toUpperCase(),
          })),
        }
      );

      if (!error) {
        toast.success("Access levels updated successfully!");
        fetchUsers();
        setIsEditing(false);
      } else {
        toast.error("Failed to update access levels.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating access levels.");
    }
  };

  const handleCancelChanges = () => {
    setUsers(JSON.parse(JSON.stringify(originalUsers)));
    setIsEditing(false);
  };

  const handleAccessLevelChange = (index, newAccessLevel) => {
    const updatedUsers = [...users];
    updatedUsers[index].access_level = newAccessLevel;
    setUsers(updatedUsers);
    setIsEditing(true);
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white py-12 px-28 w-full">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6">User Management</h1>

      {/* Add New User Section */}
      {/* <div className="bg-[#1E1E1E] border border-gray-600 rounded p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New User</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              className="w-full bg-[#2C2C2C] border border-gray-600 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Access Level</label>
            <select
              value={accessLevel}
              onChange={(e) => setAccessLevel(e.target.value)}
              className="w-full bg-[#2C2C2C] border border-gray-600 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="VIEWER">Viewer</option>
              <option value="EDITOR">Editor</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={handleAddUser}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded text-white"
          >
            Add
          </button>
        </div>
      </div> */}

      {/* Manage Existing Users Section */}
      <div className="bg-[#1E1E1E] border border-gray-600 rounded p-6">
        <h2 className="text-xl font-semibold mb-4">Manage Existing Users</h2>
        {users.length > 0 ? (
          <div className="space-y-4">
            {users.map((user, index) => (
              <div
                key={user.email}
                className="flex flex-col md:flex-row items-start md:items-center justify-between bg-[#2C2C2C] p-4 rounded border border-gray-700"
              >
                <div className="flex-1 mb-2 md:mb-0">
                  <p className="text-sm font-semibold">{user.email}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <select
                    value={user.access_level}
                    onChange={(e) => handleAccessLevelChange(index, e.target.value)}
                    className="bg-[#1E1E1E] border border-gray-600 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="VIEWER">Viewer</option>
                    <option value="EDITOR">Editor</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                  <Trash
                    size={20}
                    color="red"
                    className="cursor-pointer hover:text-red-500"
                    onClick={() => handleDeleteUser(user.email)}
                  />
                </div>
              </div>
            ))}
            {isEditing && (
              <div className="flex justify-end mt-4 space-x-4">
                <button
                  onClick={handleCancelChanges}
                  className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveChanges}
                  className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded text-white"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-gray-400">No users found.</div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
