import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchData, selectApiState } from "../store/apiSlice";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const { loading, data, error } = useSelector(selectApiState);

  const [pagination, setPagination] = useState({
    limit: 10,
    currentPage: 1,
  });
  const [filters, setFilters] = useState({});
  const [debouncedFilters, setDebouncedFilters] = useState({});
  const [allEntities, setAllEntities] = useState([]);
  const [filteredEntities, setFilteredEntities] = useState([]);

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

  const totalRecords = filteredEntities.length;
  const totalPages = Math.ceil(totalRecords / pagination.limit);
  const startIndex = (pagination.currentPage - 1) * pagination.limit;
  const paginatedEntities = filteredEntities.slice(
    startIndex,
    startIndex + pagination.limit
  );

  const navigateToDetail = (entityId) => {
    console.log("Navigating to Detail End Point: ",endpoint);
    console.log("Navigating to Detail Entity ID: ",entityId);
    
    
    navigate(`${endpoint}/${entityId}`);
  };

  return (
    <div className="min-h-screen h-full bg-gray-900 text-white py-8 px-20">
      <h1 className="text-3xl font-bold mb-5">{title}</h1>

      {error ? (
        <div className="text-center text-gray-400">
          <p>Error loading data: {error.message}</p>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-4 mb-6">
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

          <div className="flex justify-between items-center mb-4">
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
            <p className="text-gray-400">
              {totalRecords > 0
                ? `Showing ${startIndex + 1}–${Math.min(
                    startIndex + pagination.limit,
                    totalRecords
                  )} of ${totalRecords}`
                : "No records found"}
            </p>
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
                  onClick={() => navigateToDetail(entity.artist_id)}
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
                            <strong>{field.label}:</strong>{" "}
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
        </>
      )}
    </div>
  );
};

export default EntityListPage;
