import React from "react";
import { useNavigate } from "react-router-dom";
import { UploadSimple } from "phosphor-react";

const UtilitiesListPage = () => {
  const navigate = useNavigate();

  const handleFileUploaderClick = () => {
    navigate("/utilities/file-uploader");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white ml-14 w-full">
      {/* Header Section */}
      <div className="flex justify-between items-center px-8 py-4 bg-gray-800">
        <h1 className="text-2xl font-bold">Utilities</h1>
      </div>

      {/* Main Content */}
      <div className="p-8 flex justify-center items-center">
        {/* File Uploader Card */}
        <div
          className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm cursor-pointer hover:bg-gray-700 transition duration-300 ease-in-out"
          onClick={handleFileUploaderClick}
        >
          <div className="flex flex-col items-center justify-center text-center">
            <div className="text-white bg-gray-700 rounded-full p-4 mb-4">
              <UploadSimple size={48} className="text-blue-400" />
            </div>
            <h2 className="text-xl font-bold mb-2">File Uploader</h2>
            <p className="text-gray-400">Upload and manage files efficiently.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UtilitiesListPage;
