import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Box,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { makeRequest } from "../api/apiClient";

const UniversalSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (event) => {
    const value = event.target.value;
    setQuery(value);
    setNoResults(false);

    if (value.length > 0) {
      setLoading(true);
      try {
        const { data, error } = await makeRequest("get", `/search/`, {
          q: value,
        });

        if (error || !data.items || data.items.length === 0) {
          setResults([]);
          setNoResults(true);
        } else {
          setResults(data.items);
          setNoResults(false);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        setResults([]);
        setNoResults(true);
      } finally {
        setLoading(false);
      }
    } else {
      setResults([]);
    }
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setNoResults(false);
  };

  const handleResultClick = (result) => {
    if (result.nodeLabel === "Artist") {
      navigate(`/artists/${result.nodeId}`);
    } else if (result.nodeLabel === "BusinessEntity") {
      navigate(`/BE/${result.nodeId}`);
    }
    else if (result.nodeLabel === "Writer") {
        navigate(`/writers/${result.nodeId}`);
      }
      else if (result.nodeLabel === "Deal") {
        navigate(`/deals/${result.nodeId}`);
      }
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "300px",
        marginLeft: "auto",
      }}
    >
      <TextField
        value={query}
        onChange={handleSearch}
        placeholder="Search..."
        variant="outlined"
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon style={{ color: "white" }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {loading ? (
                <CircularProgress size={20} />
              ) : query.length > 0 ? (
                <IconButton onClick={handleClear}>
                  <CloseIcon style={{ color: "white" }} />
                </IconButton>
              ) : null}
            </InputAdornment>
          ),
        }}
        sx={{
          backgroundColor: "#121212",
          color: "white",
          borderRadius: "5px",
          input: { color: "white" },
          "&::placeholder": {
            color: "gray",
          },
          ".MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#444",
            },
            "&:hover fieldset": {
              borderColor: "#888",
            },
          },
        }}
      />
      {query.length > 0 && (
        <Box
          sx={{
            position: "absolute",
            top: "100%",
            left: 0,
            width: "100%",
            backgroundColor: "#1c1c1c",
            border: "1px solid #444",
            borderRadius: "4px",
            zIndex: 1000,
            maxHeight: "200px",
            overflowY: "auto",
            color: "white",
            padding: "4px",
          }}
        >
          {loading && <Box sx={{ padding: "8px", color: "#888" }}>Searching...</Box>}
          {noResults && !loading && (
            <Box sx={{ padding: "8px", color: "#888" }}>No results found</Box>
          )}
          {!loading &&
            results.map((result) => (
              <Box
                key={result.nodeId}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px",
                  cursor: "pointer",
                  borderBottom: "1px solid #333",
                  ":hover": { backgroundColor: "#333" },
                }}
                onClick={() => handleResultClick(result)}
              >
                <Box>
                  <Box sx={{ fontWeight: "bold", color: "white" }}>
                    {result.name}
                  </Box>
                  <Box sx={{ fontSize: "0.85em", color: "#888" }}>
                    ID: {result.nodeId}
                  </Box>
                </Box>
                <Box
                  sx={{
                    backgroundColor: "#444",
                    color: "white",
                    borderRadius: "12px",
                    padding: "2px 8px",
                    fontSize: "0.75em",
                  }}
                >
                  {result.nodeLabel}
                </Box>
              </Box>
            ))}
        </Box>
      )}
    </Box>
  );
};

export default UniversalSearch;
