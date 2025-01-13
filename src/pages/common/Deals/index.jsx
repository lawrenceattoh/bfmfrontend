import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { makeRequest } from "../../../api/apiClient";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

const DealsListPage = () => {
  const [allDeals, setAllDeals] = useState([]);
  const [filteredDeals, setFilteredDeals] = useState([]);
  const [filters, setFilters] = useState({ name: "", id: "" });
  const [pagination, setPagination] = useState({ offset: 0, limit: 9 });
  const [businessEntities, setBusinessEntities] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [newDeal, setNewDeal] = useState({
    name: "",
    completed_date: "",
    business_entity_id: "",
  });
  const [isCreatingDeal, setIsCreatingDeal] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Loading state added


  const limits = [9, 12, 18, 24];
  const navigate = useNavigate();

  rowCount;

  // Fetch all deals from API
  const fetchDeals = async () => {
    try {
      setIsLoading(true); // Show loader during fetch
      const { data } = await makeRequest("GET", "/deals");
      setAllDeals(data.deals || []);
      setFilteredDeals(data.deals || []);
      setRowCount(data.rowCount || 0);
    } catch (err) {
      toast.error("Error fetching deals.");
      console.error(err);
    } finally {
      setIsLoading(false); // Hide loader when done
    }
  };

  // Fetch business entities for the dropdown
  const fetchBusinessEntities = async () => {
    try {
      const { data } = await makeRequest("GET", "/business-entities");
      setBusinessEntities(data.businessEntities || []);
    } catch (err) {
      toast.error("Error fetching business entities.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDeals();
    fetchBusinessEntities();
  }, []);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    // Update the filters state
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);

    // Filter deals locally based on name and id
    const filtered = allDeals.filter((deal) => {
      const matchesName = updatedFilters.name
        ? deal.name.toLowerCase().includes(updatedFilters.name.toLowerCase())
        : true;
      const matchesId = updatedFilters.id
        ? deal.id.toLowerCase().includes(updatedFilters.id.toLowerCase())
        : true;

      return matchesName && matchesId;
    });

    setFilteredDeals(filtered);
    setPagination((prev) => ({ ...prev, offset: 0 })); // Reset to first page
  };

  // Paginate filtered deals
  const paginatedDeals = filteredDeals.slice(
    pagination.offset,
    pagination.offset + pagination.limit
  );

  // Handle pagination
  const handlePagination = (direction) => {
    setPagination((prev) => ({
      ...prev,
      offset:
        direction === "next"
          ? prev.offset + prev.limit
          : Math.max(0, prev.offset - prev.limit),
    }));
  };

  const handleItemsPerPageChange = (e) => {
    setPagination((prev) => ({
      ...prev,
      limit: parseInt(e.target.value),
      offset: 0,
    }));
  };

  const handleCreateDeal = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: newDeal.name,
        completed_date: newDeal.completed_date,
        business_entity_id: newDeal.business_entity_id,
      };

      await makeRequest("POST", "/deals", {}, payload);
      toast.success("Deal created successfully!");
      setNewDeal({ name: "", completed_date: "", business_entity_id: "" });
      setIsCreatingDeal(false);
      fetchDeals(); // Reload deals
    } catch (err) {
      toast.error("Error creating deal.");
      console.error(err);
    }
  };

  const handlePageChange = (event, value) => {
    setPagination((prev) => ({
      ...prev,
      offset: (value - 1) * pagination.limit, // Adjust offset based on page change
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#121212] text-white p-8 ml-14">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Deals</h1>
        </div>

        {/* Loader Below Deals Title */}
        <div className="flex justify-center items-center mt-8">
          <CircularProgress size={60} style={{ color: "#60a5fa" }} />
        </div>
      </div>
    );
  }





  const totalPages = Math.ceil(rowCount / pagination.limit) || 1;
  const currentPage = Math.ceil(pagination.offset / pagination.limit) + 1;

  if (isCreatingDeal || allDeals.length === 0) {
    return (
      <div className="min-h-screen text-white flex justify-center items-center ml-14 w-full">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-1/2">
          <h1 className="text-2xl font-bold mb-4">
            {allDeals.length === 0 ? "Create New Deal" : "Create New Deal"}
          </h1>
          <form onSubmit={handleCreateDeal}>
            <div className="mb-4">
              <label
                htmlFor="businessEntity"
                className="block text-gray-400 mb-2"
              >
                Business Entity
              </label>
              <TextField
                select
                fullWidth
                value={newDeal.business_entity_id}
                onChange={(e) =>
                  setNewDeal({ ...newDeal, business_entity_id: e.target.value })
                }
                required
                variant="outlined"
                InputLabelProps={{ style: { color: "#b3b3b3" } }}
                InputProps={{
                  style: {
                    color: "#fff",
                    backgroundColor: "#2c2c2c",
                  },
                }}
              >
                {businessEntities.map((entity) => (
                  <MenuItem key={entity.id} value={entity.id}>
                    {entity.name}
                  </MenuItem>
                ))}
              </TextField>
            </div>
            <div className="mb-4">
              <label htmlFor="dealName" className="block text-gray-400 mb-2">
                Deal Name
              </label>
              <TextField
                fullWidth
                id="dealName"
                value={newDeal.name}
                onChange={(e) =>
                  setNewDeal({ ...newDeal, name: e.target.value })
                }
                required
                variant="outlined"
                InputLabelProps={{ style: { color: "#b3b3b3" } }}
                InputProps={{
                  style: {
                    color: "#fff",
                    backgroundColor: "#2c2c2c",
                  },
                }}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="completedDate"
                className="block text-gray-400 mb-2"
              >
                Completed Date
              </label>
              <TextField
                fullWidth
                id="completedDate"
                type="date"
                value={newDeal.completed_date}
                onChange={(e) =>
                  setNewDeal({ ...newDeal, completed_date: e.target.value })
                }
                required
                variant="outlined"
                InputProps={{
                  style: {
                    color: "#fff",
                    backgroundColor: "#2c2c2c",
                  },
                }}
              />
            </div>
            <div className="flex justify-between">
              <Button
                type="button"
                onClick={() => setIsCreatingDeal(false)}
                style={{
                  backgroundColor: "#555",
                  color: "#fff",
                  transition: "background-color 0.3s ease, color 0.3s ease",
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                style={{
                  backgroundColor: "#1976d2",
                  color: "#fff",
                  transition: "background-color 0.3s ease, color 0.3s ease",
                }}
              >
                Submit
              </Button>
            </div>
          </form>
        </div>
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white px-20 py-12 w-full ml-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Deals</h1>
        <Button
          variant="contained"
          style={{ backgroundColor: "#60a5fa" }}
          onClick={() => setIsModalOpen(true)} // Opens the modal
        >
          CREATE NEW DEAL
        </Button>
      </div>


{/* Modal for Creating Deal */}
{isModalOpen && (
  <div
    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" // Add z-50 for higher z-index
    style={{ zIndex: 1000 }}
  >
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96 relative">
      <h2 className="text-lg font-bold mb-4 text-white">Create New Deal</h2>
      <form onSubmit={handleCreateDeal}>
        {/* Deal Name Input */}
        <div className="mb-4">
          <label className="block text-gray-400 mb-2">Deal Name</label>
          <TextField
            fullWidth
            value={newDeal.name}
            onChange={(e) =>
              setNewDeal({ ...newDeal, name: e.target.value })
            }
            required
            variant="outlined"
            InputProps={{
              style: {
                color: "#fff",
                backgroundColor: "#2c2c2c",
              },
            }}
          />
        </div>

        {/* Completed Date Input */}
        <div className="mb-4">
          <label className="block text-gray-400 mb-2">Completed Date</label>
          <TextField
            fullWidth
            type="date"
            value={newDeal.completed_date}
            onChange={(e) =>
              setNewDeal({ ...newDeal, completed_date: e.target.value })
            }
            required
            variant="outlined"
            InputProps={{
              style: {
                color: "#fff",
                backgroundColor: "#2c2c2c",
              },
              classes: {
                root: "text-white",
              },
            }}
            InputLabelProps={{
              style: { color: "#fff" },
            }}
            sx={{
              "& .MuiSvgIcon-root": {
                color: "#fff", // Makes calendar icon white
              },
            }}
          />
        </div>

        {/* Business Entity Dropdown */}
        <div className="mb-4">
          <label className="block text-gray-400 mb-2">Business Entity</label>
          <TextField
            select
            fullWidth
            value={newDeal.business_entity_id}
            onChange={(e) =>
              setNewDeal({
                ...newDeal,
                business_entity_id: e.target.value,
              })
            }
            required
            variant="outlined"
            InputProps={{
              style: {
                color: "#fff",
                backgroundColor: "#2c2c2c",
              },
            }}
            sx={{
              "& .MuiSvgIcon-root": {
                color: "#fff", // Makes dropdown arrow white
              },
            }}
          >
            {businessEntities.map((entity) => (
              <MenuItem key={entity.id} value={entity.id}>
                {entity.name}
              </MenuItem>
            ))}
          </TextField>
        </div>

        {/* Modal Actions */}
        <div className="flex justify-end mt-4 gap-2">
          <Button
            variant="outlined"
            onClick={() => setIsModalOpen(false)} // Close modal
            style={{ color: "#fff", borderColor: "#fff" }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            style={{ backgroundColor: "#60a5fa", color: "#fff" }}
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  </div>
)}


      <div className="flex items-center gap-4 mb-4">
        {/* Search Name Filter */}
        <TextField
          label="Search by Name"
          name="name"
          value={filters.name}
          onChange={handleFilterChange}
          size="small"
          className="w-40"
          InputLabelProps={{ style: { color: "#fff" } }}
          InputProps={{
            style: { color: "#fff", backgroundColor: "#333" },
          }}
        />

        {/* Search ID Filter */}
        <TextField
          label="Search by ID"
          name="id"
          value={filters.id}
          onChange={handleFilterChange}
          size="small"
          className="w-40"
          InputLabelProps={{ style: { color: "#fff" } }}
          InputProps={{
            style: { color: "#fff", backgroundColor: "#333" },
          }}
        />

        {/* Items Per Page Filter */}
        <TextField
          label="Items per Page"
          select
          value={pagination.limit}
          onChange={handleItemsPerPageChange}
          size="small"
          className="w-40"
          InputLabelProps={{ style: { color: "#fff" } }}
          InputProps={{
            style: { color: "#fff", backgroundColor: "#333" },
          }}
          SelectProps={{
            MenuProps: {
              MenuListProps: {
                sx: {
                  backgroundColor: "#333",
                  color: "#fff",
                },
              },
            },
          }}
        >
          {limits.map((limit) => (
            <MenuItem key={limit} value={limit}>
              {limit}
            </MenuItem>
          ))}
        </TextField>
      </div>

      {/* Cards */}
      {filteredDeals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredDeals
            .slice(pagination.offset, pagination.offset + pagination.limit)
            .map((deal) => (
              <div
                key={deal.id}
                onClick={() => navigate(`/deals/${deal.id}`)}
                className="p-4 bg-[#1E1E1E] text-white rounded-lg shadow-lg border border-gray-500 
                     hover:bg-gray-600 transition-all duration-300 cursor-pointer"
              >
                <h2 className="text-lg font-bold mb-2 text-white">
                  {deal.name}
                </h2>
                <span className="inline-block px-3 py-1 text-sm rounded-full border border-cyan-200 text-cyan-200">
                  {deal.id}
                </span>
              </div>
            ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-64">
          <h2 className="text-xl font-bold text-gray-400">No deals found</h2>
        </div>
      )}

      {/* Pagination */}
      <Box display="flex" justifyContent="center" mt={4}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          size="large"
          sx={{
            "& .MuiPaginationItem-root": {
              color: "#fff", // Text color
            },
            "& .MuiPaginationItem-icon": {
              color: "#fff", // Arrow color
            },
            "& .Mui-selected": {
              backgroundColor: "#60a5fa", // Selected page background
              color: "#fff",
            },
          }}
        />
      </Box>

      <ToastContainer />
    </div>
  );
};

export default DealsListPage;
