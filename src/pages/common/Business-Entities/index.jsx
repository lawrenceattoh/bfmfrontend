import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { makeRequest } from "../../../api/apiClient";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const BusinessEntitiesListPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "" });
  const [businessEntities, setBusinessEntities] = useState([]);
  const [filters, setFilters] = useState({ name: "" });
  const [pagination, setPagination] = useState({ offset: 0, limit: 10 });
  const [rowCount, setRowCount] = useState(0);

  const limits = [5, 10, 20, 50];

  // Fetch business entities from API
  const fetchBusinessEntities = async () => {
    const { data, error } = await makeRequest(
      "GET",
      "/business-entities/",
      filters,
      {},
      pagination
    );

    if (error) {
      console.error("Error fetching business entities:", error);
    } else {
      setBusinessEntities(data.businessEntities || []);
      setRowCount(data.rowCount || 0);
    }
  };

  useEffect(() => {
    fetchBusinessEntities();
  }, [filters, pagination]);

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPagination((prev) => ({ ...prev, offset: 0 })); // Reset to first page on filter change
  };

  // Handle pagination
  const handlePagination = (direction) => {
    setPagination((prev) => ({
      ...prev,
      offset:
        direction === "next"
          ? prev.offset + prev.limit
          : prev.offset - prev.limit,
    }));
  };

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    setPagination((prev) => ({
      ...prev,
      limit: parseInt(e.target.value),
      offset: 0,
    }));
  };

  // Modal handlers
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setFormData({ name: "" });
    setIsModalOpen(false);
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const { data, error } = await makeRequest(
        "POST",
        "/business-entities/",
        {},
        formData
      );

      if (error) {
        toast.error(
          "Failed to create a new business entity. Please try again."
        );
        console.error("Error creating business entity:", error);
      } else {
        toast.success(`Business entity "${data.name}" created successfully.`);
        fetchBusinessEntities(); // Reload the data
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
      console.error("Error:", error);
    } finally {
      handleCloseModal(); // Close the modal
    }
  };

  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen text-white ml-14 w-full">
      {/* Header Section */}
      <div className="flex justify-between items-center px-8 py-4 bg-gray-800">
        <h1 className="text-2xl font-bold">Business Entities</h1>
        <Button variant="contained" color="primary" onClick={handleOpenModal}>
          Create New Business Entity
        </Button>
      </div>

      {/* Filters */}
      <div className="px-8 py-4 flex items-center gap-4">
        <TextField
          label="Search Name"
          name="name"
          value={filters.name}
          onChange={handleFilterChange}
          size="small"
          InputLabelProps={{ style: { color: "#b3b3b3" } }}
          InputProps={{
            style: {
              color: "#fff",
              backgroundColor: "#2c2c2c",
              fontSize: "14px",
            },
          }}
          style={{ marginTop: "0.5%" }}
        />
        <TextField
          select
          label="Items per page"
          value={pagination.limit}
          onChange={handleItemsPerPageChange}
          size="small"
          InputLabelProps={{ style: { color: "#b3b3b3" } }}
          InputProps={{
            style: {
              color: "#fff",
              backgroundColor: "#2c2c2c",
              marginTop: "8%",
            },
          }}
          className="w-32"
        >
          {limits.map((limit) => (
            <MenuItem key={limit} value={limit}>
              {limit}
            </MenuItem>
          ))}
        </TextField>
      </div>

      {/* Main Content */}
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {businessEntities.length === 0 ? (
          <div className="text-center text-gray-400 text-xl">
            No business entities found.
          </div>
        ) : (
          businessEntities.map((entity) => (
            <div
              key={entity.id}
              className="bg-gray-800 p-4 rounded-lg shadow-lg"
            >
              <h2 className="text-xl font-bold">{entity.name}</h2>
              <p className="text-gray-400">ID: {entity.id}</p>
              <p className="text-gray-400">Created By: {entity.created_by}</p>
              <p className="text-gray-400">
                Created At: {new Date(entity.created_at).toLocaleDateString()}
              </p>
              <button
                className="mt-2 text-blue-500 hover:underline"
                onClick={() => navigate(`/business-entities/${entity.id}`)}
              >
                View Details
              </button>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="px-8 py-4 flex justify-between items-center">
        <Button
          variant="contained"
          onClick={() => handlePagination("prev")}
          disabled={pagination.offset === 0}
          style={{
            backgroundColor: pagination.offset === 0 ? "#555" : "#1976d2", // Disabled: gray, Enabled: blue
            color: pagination.offset === 0 ? "#999" : "#fff", // Disabled: lighter text color
            transition: "background-color 0.3s ease, color 0.3s ease", // Smooth transition
          }}
        >
          Previous
        </Button>
        <Button
          variant="contained"
          onClick={() => handlePagination("next")}
          disabled={pagination.offset + pagination.limit >= rowCount}
          style={{
            backgroundColor:
              pagination.offset + pagination.limit >= rowCount
                ? "#555"
                : "#1976d2", // Disabled: gray, Enabled: blue
            color:
              pagination.offset + pagination.limit >= rowCount
                ? "#999"
                : "#fff", // Disabled: lighter text color
            transition: "background-color 0.3s ease, color 0.3s ease", // Smooth transition
          }}
        >
          Next
        </Button>
      </div>

      {/* Modal for Creating New Entity */}
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="create-business-entity"
        aria-describedby="create-new-business-entity-modal"
      >
        <Box
          className="bg-gray-800 p-6 rounded-md shadow-lg w-96 mx-auto mt-40"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <h2 className="text-lg font-bold text-white">
            Create Business Group
          </h2>
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            fullWidth
            InputLabelProps={{ style: { color: "#b3b3b3" } }}
            InputProps={{
              style: { color: "#fff", backgroundColor: "#2c2c2c" },
            }}
          />
          <div className="flex justify-end gap-4 mt-4">
            <Button variant="outlined" color="error" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </Box>
      </Modal>

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default BusinessEntitiesListPage;
