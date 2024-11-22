import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    CircularProgress,
    Grid,
    Card,
    CardContent,
    TextField,
    Pagination,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchData, selectApiState } from "../store/apiSlice";
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

const EntityListPage = ({ title, endpoint, schema, dataKey, filters: initialFilters = {} }) => {
    const dispatch = useDispatch();
    const { loading, data, error } = useSelector(selectApiState);
    const [pagination, setPagination] = useState({ limit: 10, offset: 0, order: "asc" });
    const [filters, setFilters] = useState(initialFilters); // Initialize with passed filters
    const [debouncedFilters, setDebouncedFilters] = useState({});

    const applyDebouncedFilters = debounce((newFilters) => {
        setDebouncedFilters(newFilters);
    }, 300);

    useEffect(() => {
        applyDebouncedFilters(filters);
    }, [filters]);

    useEffect(() => {
        const params = { ...debouncedFilters, ...filters }; // Merge initial filters with user-provided ones
        dispatch(fetchData({ endpoint, pagination, params }));
    }, [dispatch, endpoint, pagination, debouncedFilters, filters]);

    const handlePageChange = (event, page) => {
        setPagination((prev) => ({
            ...prev,
            offset: (page - 1) * prev.limit, // Adjust offset based on page
        }));
    };

    const handleRowsPerPageChange = (event) => {
        setPagination((prev) => ({
            ...prev,
            limit: parseInt(event.target.value, 10),
            offset: 0, // Reset to the first page
        }));
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const entities = data?.[dataKey] || [];
    const totalPages = Math.ceil((data?.rowCount || 0) / pagination.limit); // Total number of pages
    const currentPage = Math.floor(pagination.offset / pagination.limit) + 1; // Current page number

    return (
        <Box display="flex" sx={{ p: 4 }}>
            <Box flex={1}>
                <Typography variant="h4" gutterBottom>
                    {title}
                </Typography>

                <Grid container spacing={3}>
                    {loading || entities.length === 0
                        ? [...Array(12)].map((_, index) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                                <Card
                                    variant="outlined"
                                    sx={{
                                        height: "100%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        opacity: loading ? 0.5 : 1,
                                    }}
                                >
                                    {loading ? (
                                        <CircularProgress size={24} />
                                    ) : (
                                        <Typography color="textSecondary">No data available</Typography>
                                    )}
                                </Card>
                            </Grid>
                        ))
                        : entities.map((entity) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={entity.id}>
                                <Card
                                    component={Link}
                                    to={`/publishing/works/${entity.id}`} // Updated to point directly to the works route
                                    variant="outlined"
                                    sx={{
                                        height: "100%",
                                        display: "block",
                                        textDecoration: "none",
                                        color: "inherit",
                                    }}
                                >
                                    <CardContent>
                                        {schema.map((field) => (
                                            <Typography
                                                key={field.key}
                                                variant="body2"
                                                color="textSecondary"
                                                gutterBottom
                                            >
                                                <strong>{field.label}:</strong>{" "}
                                                {displayTypeConverter(field.displayType, entity[field.key])}
                                            </Typography>
                                        ))}
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                </Grid>

                <Box mt={4} display="flex" justifyContent="space-between" alignItems="center">
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                    />
                    <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                        <InputLabel>Rows</InputLabel>
                        <Select
                            value={pagination.limit}
                            onChange={handleRowsPerPageChange}
                            label="Rows"
                        >
                            {[5, 10, 20, 50].map((size) => (
                                <MenuItem key={size} value={size}>
                                    {size}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </Box>

            <Box
                sx={{
                    width: 300,
                    ml: 4,
                    borderLeft: "1px solid #ddd",
                    pl: 3,
                }}
            >
                <Typography variant="h6" gutterBottom>
                    Filters
                </Typography>
                <Box display="flex" flexDirection="column" gap={2}>
                    {schema
                        .filter((field) => field.isFilterable)
                        .map((field) => (
                            <TextField
                                key={field.key}
                                label={field.label}
                                name={field.key}
                                value={filters[field.key] || ""}
                                onChange={handleFilterChange}
                                fullWidth
                                variant="outlined"
                                placeholder={`Search ${field.label}`}
                            />
                        ))}
                </Box>
                <Button
                    sx={{ mt: 3 }}
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => dispatch(fetchData({ endpoint, pagination, params: filters }))}
                >
                    Apply Filters
                </Button>
            </Box>
        </Box>
    );
};

export default EntityListPage;
