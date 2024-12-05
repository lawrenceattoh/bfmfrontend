import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchData, selectApiState } from "../store/apiSlice";
import { makeRequest } from "../api/apiClient";
import { debounce } from "lodash";

const displayTypeConverter = (type, value) => {
  switch (type) {
    case "date":
      return new Date(value).toLocaleDateString();
    case "boolean":
      return value ? "Yes" : "No";
    default:
      return value || "N/A";
  }
};

const EntityListPage = ({ title, endpoint, displaySchema, filterSchema, dataKey }) => {
  const dispatch = useDispatch();
  const { loading, data, error } = useSelector(selectApiState);

  const [pagination, setPagination] = useState({
    limit: 10,
    currentPage: 1,
  });
  const [filters, setFilters] = useState({});
  const [debouncedFilters, setDebouncedFilters] = useState({});
  const [allEntities, setAllEntities] = useState([]);
  const [filteredEntities, setFilteredEntities] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    image_url: "",
    spotify_id: "",
    apple_music_id: "",
    facebook_id: "",
    youtube_id: "",
    instagram_id: "",
    twitter_id: "",
    bio: "",
  });

  const applyDebouncedFilters = debounce((newFilters) => {
    setDebouncedFilters(newFilters);
  }, 300);

  useEffect(() => {
    if (data && Array.isArray(data[dataKey])) {
      setAllEntities(data[dataKey]);
      setFilteredEntities(data[dataKey]);
    }
  }, [data, dataKey]);

  useEffect(() => {
    applyDebouncedFilters(filters);
  }, [filters]);

  useEffect(() => {
    dispatch(fetchData({ endpoint }));
  }, [dispatch, endpoint]);

  useEffect(() => {
    let filtered = [...allEntities];
    Object.keys(debouncedFilters).forEach((key) => {
      const value = debouncedFilters[key]?.toLowerCase();
      if (value) {
        filtered = filtered.filter((entity) =>
          String(entity[key]).toLowerCase().includes(value)
        );
      }
    });
    setFilteredEntities(filtered);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  }, [debouncedFilters, allEntities]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLimitChange = (e) => {
    const limit = parseInt(e.target.value, 10);
    setPagination((prev) => ({
      ...prev,
      limit,
      currentPage: 1,
    }));
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: newPage,
    }));
  };

  const handleCreateClick = () => {
    setFormData({
      name: "",
      image_url: "",
      spotify_id: "",
      apple_music_id: "",
      facebook_id: "",
      youtube_id: "",
      instagram_id: "",
      twitter_id: "",
      bio: "",
    });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const apiUrl = "/artists/";
    try {
      
      const { data, error } = await makeRequest("POST", apiUrl, {}, formData);
      console.log("DATA ON POST ARTIST ",data);
      if (!error && data) {
        setIsModalOpen(false);
        dispatch(fetchData({ endpoint }));
      } else {
        console.error("Error creating artist:", error);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const totalRecords = filteredEntities.length;
  const totalPages = Math.ceil(totalRecords / pagination.limit);
  const startIndex = (pagination.currentPage - 1) * pagination.limit;
  const paginatedEntities = filteredEntities.slice(
    startIndex,
    startIndex + pagination.limit
  );

  return (
    <div className="min-h-screen h-full bg-gray-900 text-white py-8 px-20 mb-48">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{title}</h1>
        <div className="flex gap-4">
          {(filterSchema || [])
            .filter((field) => field.isFilterable)
            .map((field) => (
              <input
                key={field.key}
                name={field.key}
                placeholder={`Search ${field.label}`}
                value={filters[field.key] || ""}
                onChange={handleFilterChange}
                className="p-2 rounded bg-gray-800 text-white outline-none"
              />
            ))}
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        {endpoint === "/artists" && (
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
            onClick={handleCreateClick}
          >
            Create New Artist
          </button>
        )}
        <div>
          <label className="text-gray-400 mr-2">Items per page:</label>
          <select
            value={pagination.limit}
            onChange={handleLimitChange}
            className="p-2 rounded bg-gray-800 text-white"
          >
            {[5, 10, 15, 20, 35, 50, 100].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {loading ? (
          [...Array(pagination.limit)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg h-40 animate-pulse"
            ></div>
          ))
        ) : paginatedEntities.length > 0 ? (
          paginatedEntities.map((entity) => (
            <div
              key={entity.id}
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl cursor-pointer"
              onClick={() => console.log("Navigate to details", entity)}
            >
              <img
                src={entity.image_url}
                alt={`Image for ${entity.artist_id}`}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                {entity.name && (
                  <h2 className="text-lg font-bold text-white truncate">
                    {entity.name}
                  </h2>
                )}
                {(displaySchema || []).map(
                  (field) =>
                    field.key !== "image_url" && (
                      <p
                        key={field.key}
                        className="text-sm text-gray-400 truncate"
                      >
                        <strong>{field.label}</strong>{" "}
                        {displayTypeConverter(
                          field.displayType,
                          entity[field.key]
                        )}
                      </p>
                    )
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-400">
            No data available
          </div>
        )}
      </div>

      {totalRecords > 0 && (
        <div className="flex justify-center items-center mt-6 space-x-4">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className={`px-4 py-2 rounded ${
              pagination.currentPage === 1
                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
          >
            Previous
          </button>
          <span className="text-gray-400">
            Page {pagination.currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === totalPages}
            className={`px-4 py-2 rounded ${
              pagination.currentPage === totalPages
                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
          >
            Next
          </button>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-4 text-white">Create New Artist</h2>
            <div className="space-y-4">
              {Object.keys(formData).map((key) => (
                <div key={key}>
                  <label className="block text-sm text-gray-300 mb-1">
                    {key.replace("_", " ").toUpperCase()}
                  </label>
                  <input
                    type="text"
                    name={key}
                    value={formData[key]}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded bg-gray-700 text-white outline-none"
                  />
                </div>
              ))}
              <div className="flex justify-end gap-4">
                <button
                  onClick={handleModalClose}
                  className="py-2 px-4 rounded bg-gray-700 hover:bg-gray-600 text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="py-2 px-4 rounded bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EntityListPage;
