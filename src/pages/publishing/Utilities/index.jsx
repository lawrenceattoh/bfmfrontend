import React from "react";
import { useNavigate } from "react-router-dom";
import { UploadSimple, UsersThree } from "phosphor-react";

const UtilitiesListPage = () => {
  const navigate = useNavigate();

  const handleFileUploaderClick = () => {
    navigate("/utilities/file-uploader");
  };

  const handleUserManagementClick = () => {
    navigate("/utilities/user-management");
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white w-full ml-14 p-4">
      {/* Header Section */}
      <div className="px-8 py-6">
        <h1 className="text-4xl font-semibold">Utilities</h1>
      </div>

      {/* Main Content */}
      <div className="flex justify-center items-center gap-8 px-8">
        {/* File Uploader Card */}
        <div
          className="flex flex-col justify-center items-center text-center w-80 p-6 border border-gray-500 rounded-lg hover:bg-gray-800 transition duration-300 cursor-pointer"
          onClick={handleFileUploaderClick}
        >
          <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full border border-gray-500">
            <UploadSimple size={32} className="text-white" />
          </div>
          <h2 className="text-lg font-bold mb-1">File Uploader</h2>
          <p className="text-gray-400 text-sm">Upload and manage files efficiently.</p>
        </div>

        {/* User Management Card */}
        <div
          className="flex flex-col justify-center items-center text-center w-80 p-6 border border-gray-500 rounded-lg hover:bg-gray-800 transition duration-300 cursor-pointer"
          onClick={handleUserManagementClick}
        >
          <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full border border-gray-500">
            <UsersThree size={32} className="text-white" />
          </div>
          <h2 className="text-lg font-bold mb-1">User Management</h2>
          <p className="text-gray-400 text-sm">Manage users and their permissions.</p>
        </div>
      </div>
    </div>
  );
};

export default UtilitiesListPage;
