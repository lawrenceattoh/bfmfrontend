import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchData, selectApiState } from "../store/apiSlice";
import { makeRequest } from "../api/apiClient";
import { debounce } from "lodash";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Pagination from "@mui/material/Pagination";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";

const EntityListPage = ({
  title,
  endpoint,
  displaySchema,
  filterSchema,
  dataKey,
  singularTitle, // Add singular title
}) => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { loading, data } = useSelector(selectApiState);

  const [allArtists, setAllArtists] = useState([]);

  const [pagination, setPagination] = useState({ limit: 9, offset: 0 });
  const [filters, setFilters] = useState({});
  const [debouncedFilters, setDebouncedFilters] = useState({});
  const [allEntities, setAllEntities] = useState([]);
  const [filteredEntities, setFilteredEntities] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const singular = singularTitle || title.slice(0, -1); // Use singularTitle if provided

  const itemsPerPageOptions = [5, 9, 15, 20]; // Dropdown options for items per page

  const [allWriters, setAllWriters] = useState([]);

  useEffect(() => {
    const fetchWriters = async () => {
      if (endpoint === "/works") {
        try {
          const { data, error } = await makeRequest("GET", "/writers");
          console.log("Fetched Writers:", data); // Log the entire response
          if (!error) {
            // Access `writers` key in the API response
            setAllWriters(Array.isArray(data.writers) ? data.writers : []);
          } else {
            console.error("Failed to fetch writers:", error);
          }
        } catch (err) {
          console.error("Error fetching writers:", err);
        }
      }
    };

    fetchWriters();
  }, [endpoint]);

  // Fetch artists for dropdown
  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const { data } = await makeRequest("GET", "/artists");
        setAllArtists(data.artists || []);
      } catch (err) {
        console.error("Error fetching artists:", err);
      }
    };

    if (endpoint === "/tracks") {
      fetchArtists();
    }
  }, [endpoint]);

  const initialFormData =
    endpoint === "/artists"
      ? {
          name: "",
          // image_url: "",
          // spotify_id: "",
          // apple_music_id: "",
          // facebook_id: "",
          // youtube_id: "",
          // instagram_id: "",
          // twitter_id: "",
          // bio: "",
        }
      : endpoint === "/tracks"
      ? {
          name: "",
          artist_name: "",
          artist_id: "",
        }
      : {};

  endpoint === "/works"
    ? {
        name: "",
        iswc: "",
        writers: [], // Multi-select field
      }
    : {
        name: "",
        alias: "",
        ipi: "",
      };

  const [formData, setFormData] = useState(initialFormData);

  const applyDebouncedFilters = debounce((newFilters) => {
    setDebouncedFilters(newFilters);
  }, 300);

  useEffect(() => {
    dispatch(fetchData({ endpoint }));
  }, [dispatch, endpoint]);

  useEffect(() => {
    if (data && Array.isArray(data[dataKey])) {
      setAllEntities(data[dataKey]);
      setRowCount(data.rowCount || 0);
    }
  }, [data, dataKey]);

  useEffect(() => {
    applyDebouncedFilters(filters);
  }, [filters]);

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
  }, [debouncedFilters, allEntities]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPagination((prev) => ({ ...prev, offset: 0 }));
  };

  const handlePageChange = (event, page) => {
    setPagination((prev) => ({
      ...prev,
      offset: (page - 1) * pagination.limit,
    }));
  };

  const handleItemsPerPageChange = (e) => {
    setPagination((prev) => ({
      ...prev,
      limit: parseInt(e.target.value, 10),
      offset: 0, // Reset to first page
    }));
  };

  const handleCreateClick = () => {
    setFormData(initialFormData);
    setIsModalOpen(true);
  };

  const handleModalClose = () => setIsModalOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      let payload = { ...formData };

      const { data } = await makeRequest("POST", endpoint, {}, formData);
      if (endpoint === "/writers" && data === null) {
        toast.success("Writer added successfully!");
      } else if (endpoint === "/works") {
        payload = {
          name: formData.name,
          iswc: formData.iswc,
          writers: formData.writers.map((writer) => ({
            writer_id: writer.id,
            writer_name: writer.name,
            ipi: writer.ipi,
          })),
        };
        
        

        console.log("Submitting payload:", payload); // Debugging: Log the formatted payload

        toast.success(`${title.slice(0, -1)} added successfully!`);
        dispatch(fetchData({ endpoint }));
        handleModalClose();
      } else if (endpoint === "/tracks") {
         payload = {
          name: formData.name,
          artist_name: formData.artist_name,
          artist_id: formData.artist_id,
        };
        
        

        console.log("Submitting payload:", payload); // Debugging: Log the formatted payload

        toast.success(`${title.slice(0, -1)} added successfully!`);
        dispatch(fetchData({ endpoint }));
        handleModalClose();

      }
       else {
        // toast.success(`${title.slice(0, -1)} added successfully!`);
        toast.success(`${singular} added successfully!`);
      }
      dispatch(fetchData({ endpoint }));
      handleModalClose();
    } catch (error) {
      // toast.error("Failed to add entity.");
      toast.error(`Failed to add ${singular.toLowerCase()}.`);
    }
  };

  const totalPages = Math.ceil(rowCount / pagination.limit) || 1;
  const currentPage = Math.ceil(pagination.offset / pagination.limit) + 1;

  return (
    <div className="min-h-screen bg-[#121212] text-white px-20 py-12 w-full ml-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">{title}</h1>
        <Button
          variant="contained"
          style={{ backgroundColor: "#60a5fa" }}
          onClick={handleCreateClick}
        >
          {/* {`Create New ${title.slice(0, -1)}`} */}
          {`Create New ${singular}`}
        </Button>
      </div>

      {/* Items Per Page Dropdown */}
      <div className="flex items-center gap-4 mb-4">
        <TextField
          select
          label="Items per Page"
          value={pagination.limit}
          onChange={handleItemsPerPageChange}
          variant="outlined"
          size="small"
          InputLabelProps={{ style: { color: "#fff" } }}
          InputProps={{
            style: { color: "#fff", backgroundColor: "#333" },
          }}
          sx={{ width: 200 }}
        >
          {itemsPerPageOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-4">
        {(filterSchema || []).map((filter) => (
          <TextField
            key={filter.key}
            label={filter.label}
            name={filter.key}
            value={filters[filter.key] || ""}
            onChange={handleFilterChange}
            variant="outlined"
            size="small"
            InputLabelProps={{ style: { color: "#fff" } }}
            InputProps={{
              style: { color: "#fff", backgroundColor: "#333" },
            }}
          />
        ))}
      </div>

     {/* Cards */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {loading ? (
    [...Array(pagination.limit)].map((_, index) => (
      <div
        key={index}
        className="bg-gray-800 rounded-lg h-40 animate-pulse"
      ></div>
    ))
  ) : filteredEntities.length > 0 ? (
    filteredEntities
      .slice(pagination.offset, pagination.offset + pagination.limit)
      .map((entity) => (
        <div
          key={entity.id}
          className="p-4 bg-[#1E1E1E] text-white rounded-lg shadow-lg border border-gray-500 
          hover:bg-gray-600 transition-all duration-300 cursor-pointer"
          onClick={() => {
            if (endpoint === "/tracks") {
              navigate(`/tracks/${entity.id}`); // Redirect to track detail page
            } else if (endpoint === "/artists") {
              navigate(`/artists/${entity.id}`); // Redirect to artist detail page
            } else if (endpoint === "/writers") {
              navigate(`/writers/${entity.id}`); // Redirect to writer detail page
            } else if (endpoint === "/business-entities") {
              navigate(`/BE/${entity.id}`); // Redirect to business entity detail page
            }
          }}
        >
          <h2 className="text-lg font-bold mb-2 text-white">{entity.name}</h2>
          {endpoint === "/tracks" && entity.artist_name && (
            <p className="text-sm text-gray-400">{`Artist: ${entity.artist_name}`}</p>
          )}
          {entity.ipi && endpoint === "/writers" && (
            <p className="text-sm text-gray-400">{`IPI: ${entity.ipi}`}</p>
          )}
          <span className="inline-block px-3 py-1 text-sm rounded-full border border-cyan-200 text-cyan-200 mt-4">
            {entity.id}
          </span>
        </div>
      ))
  ) : (
    <div className="col-span-full text-center text-gray-400 text-xl mt-8">
      No Data Available
    </div>
  )}
</div>


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
              color: "#fff",
            },
            "& .MuiPaginationItem-icon": {
              color: "#fff",
            },
            "& .Mui-selected": {
              backgroundColor: "#60a5fa",
              color: "#fff",
            },
          }}
        />
      </Box>

      {/* Modal */}
      <Modal open={isModalOpen} onClose={handleModalClose}>
        <Box className="bg-gray-800 p-4 rounded-lg w-96 mx-auto mt-10">
          <h2 className="text-lg font-bold mb-4 text-white">
            {/* {`Create ${title.slice(
            0,
            -1
          )}`} */}
            {`Create ${singular}`}
          </h2>
          <div className="space-y-4">
            {Object.keys(formData).map((key) => {
              if (key === "writers") {
                return (
                  <div key={key}>
                    <label className="text-white text-sm mb-2 block">
                      Writers
                    </label>
                    <Select
                      multiple
                      value={formData.writers}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          writers: e.target.value,
                        }));
                      }}
                      renderValue={
                        (selected) =>
                          selected.map((writer) => writer.name).join(", ") // Display selected writer names
                      }
                      fullWidth
                      style={{
                        backgroundColor: "#333",
                        color: "#fff",
                        borderRadius: "4px",
                      }}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 400, // Set a fixed height for the dropdown
                            overflowY: "auto", // Enable scrolling for overflow
                          },
                        },
                      }}
                    >
                      {Array.isArray(allWriters) &&
                        allWriters.map((writer) => (
                          <MenuItem key={writer.id} value={writer}>
                            <Checkbox
                              checked={formData.writers.some(
                                (selected) => selected.id === writer.id
                              )}
                            />
                            {writer.name}
                          </MenuItem>
                        ))}
                    </Select>
                  </div>
                );
              }
              else if (key === "artist_name") {
                return (
                  <div key={key}>
                    {/* <label className="text-white text-sm mb-2 block">Select Artist</label> */}
                    <Select
                      value={formData.artist_id || ""} // Default to empty if no artist is selected
                      onChange={(e) => {
                        const selectedArtist = allArtists.find(
                          (artist) => artist.id === e.target.value
                        );
                        setFormData((prev) => ({
                          ...prev,
                          artist_id: selectedArtist?.id || "",
                          artist_name: selectedArtist?.name || "",
                        }));
                      }}
                      fullWidth
                      style={{
                        backgroundColor: "#333",
                        color: "#fff",
                        borderRadius: "4px",
                      }}
                      displayEmpty
                    >
                      <MenuItem value="" disabled>
                        Select an Artist
                      </MenuItem>
                      {allArtists.map((artist) => (
                        <MenuItem key={artist.id} value={artist.id}>
                          {artist.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>
                );
              }
              
              return (
                <TextField
                  key={key}
                  label={key.replace("_", " ").toUpperCase()}
                  name={key}
                  value={formData[key]}
                  onChange={handleInputChange}
                  fullWidth
                  InputLabelProps={{ style: { color: "#fff" } }}
                  InputProps={{
                    style: {
                      color: "#fff",
                      backgroundColor: "#333",
                      borderRadius: "4px",
                    },
                  }}
                />
              );
            })}
          </div>

          <div className="flex justify-end gap-4 mt-4">
            <Button variant="outlined" onClick={handleModalClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              style={{ backgroundColor: "#60a5fa" }}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>
        </Box>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default EntityListPage;
