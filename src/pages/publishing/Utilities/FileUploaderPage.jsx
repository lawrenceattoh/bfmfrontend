import React, { useState } from "react";

const FileUploaderPage = () => {
  const [formData, setFormData] = useState({
    mainCategory: "",
    subCategory: "",
    businessEntity: "",
    dealName: "",
    date: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log("Form Data Submitted: ", formData);
    // Add submit logic
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-8 py-8 w-full">
      {/* Header Section */}
      <h1 className="text-3xl font-bold mb-8 text-center">File Uploader</h1>

      {/* Form Section */}
      <div className="max-w-6xl mx-auto bg-gray-800 rounded-lg shadow-lg p-8">
        {/* Main Category and Sub Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label
              htmlFor="mainCategory"
              className="block text-gray-400 text-sm mb-2"
            >
              Main Category
            </label>
            <select
              id="mainCategory"
              name="mainCategory"
              value={formData.mainCategory}
              onChange={handleInputChange}
              className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Select Main Category
              </option>
              <option value="scheduleOfWork">Schedule of Work</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="subCategory"
              className="block text-gray-400 text-sm mb-2"
            >
              Sub Category
            </label>
            <select
              id="subCategory"
              name="subCategory"
              value={formData.subCategory}
              onChange={handleInputChange}
              className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Select Sub Category
              </option>
              <option value="publishing">Publishing</option>
              <option value="licensing">Licensing</option>
            </select>
          </div>
        </div>

        {/* Schedule of Work Section */}
        <h2 className="text-2xl font-semibold text-white mb-4">
          Schedule of Work
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label
              htmlFor="businessEntity"
              className="block text-gray-400 text-sm mb-2"
            >
              Business Entity
            </label>
            <input
              id="businessEntity"
              name="businessEntity"
              placeholder="Search or create new Business Group"
              value={formData.businessEntity}
              onChange={handleInputChange}
              className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="dealName"
              className="block text-gray-400 text-sm mb-2"
            >
              Deal Name
            </label>
            <input
              id="dealName"
              name="dealName"
              value={formData.dealName}
              onChange={handleInputChange}
              className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="date" className="block text-gray-400 text-sm mb-2">
              Date
            </label>
            <input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-8">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileUploaderPage;
