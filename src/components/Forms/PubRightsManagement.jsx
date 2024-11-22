import React, { useEffect, useState, useCallback } from "react";
import {
    Box,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Grid,
    TextField,
    Autocomplete,
    Typography,
    IconButton,
    Button,
    CircularProgress,
} from "@mui/material";
import { ExpandMore, Add, Delete } from "@mui/icons-material";
import { makeRequest } from "../../api/apiClient.jsx";
import RightsTypeIndicator from "../RightsTypeIndicator";

const PubRightsManagement = ({ fields, append, remove, work, editing, setValue }) => {
    const [publishers, setPublishers] = useState([]);
    const [writers, setWriters] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searching, setSearching] = useState(false);

    // Fetch initial data for publishers and writers
    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            const [pubResponse, writerResponse] = await Promise.all([
                makeRequest("GET", "/publishers"),
                makeRequest("GET", "/writers"),
            ]);

            if (!pubResponse.error) setPublishers(pubResponse.data.publishers || []);
            if (!writerResponse.error) setWriters(writerResponse.data.writers || []);
            setLoading(false);
        };
        fetchInitialData();
    }, []);

    // Dynamic search for Autocomplete
    const handleSearch = useCallback(async (type, query) => {
        setSearching(true);
        const endpoint = type === "Publisher Share" ? "/publishers" : "/writers";
        const { data, error } = await makeRequest("GET", endpoint, { search: query });
        if (!error) {
            if (type === "Publisher Share") setPublishers(data.publishers || []);
            else setWriters(data.writers || []);
        }
        setSearching(false);
    }, []);

    // Add a new right
    const handleAddRight = (type) => {
        append({
            type,
            rightsholder_name: "",
            ipi: "",
            share: 0,
            deal_id: "",
            internal_ip_ref: "",
            mech_share: type === "Publisher Share" ? 0 : undefined,
            is_controlled: type === "Publisher Share" ? false : undefined,
        });
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Rights Management
            </Typography>
            {fields.map((field, index) => (
                <Accordion key={field.id || index}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <RightsTypeIndicator
                                publishers={field.type === "Publisher Share" ? [{ ipi: field.ipi }] : []}
                                writers={field.type === "Writer Share" ? [{}] : []}
                            />
                            <Typography>
                                {field.rightsholder_name || `Right ${index + 1}`} - {field.share || 0}%
                            </Typography>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Autocomplete
                                    options={field.type === "Publisher Share" ? publishers : writers}
                                    getOptionLabel={(option) => option.name || ""}
                                    value={
                                        (field.type === "Publisher Share" ? publishers : writers).find(
                                            (option) => option.id === field.id
                                        ) || null
                                    }
                                    onChange={(e, newValue) => {
                                        setValue(`rights.${index}.rightsholder_name`, newValue?.name || "");
                                        setValue(`rights.${index}.ipi`, newValue?.ipi || "");
                                        // setValue(`rights.${index}.internal_ip_ref`, newValue?.internal_ip_ref || "");
                                        setValue(`rights.${index}.deal_id`, newValue?.deal_id || ""); // Add deal_id
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Rightsholder Name"
                                            onChange={(e) => handleSearch(field.type, e.target.value)}
                                            fullWidth
                                            disabled={!editing}
                                        />
                                    )}
                                    loading={searching}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="IPI"
                                    value={field.ipi || ""}
                                    disabled
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Share (%)"
                                    value={field.share || ""}
                                    onChange={(e) => setValue(`rights.${index}.share`, e.target.value)}
                                    disabled={!editing}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Deal ID"
                                    value={field.deal_id || ""}
                                    onChange={(e) => setValue(`rights.${index}.deal_id`, e.target.value)}
                                    disabled={!editing}
                                    fullWidth
                                />
                            </Grid>
                            {field.type === "Publisher Share" && (
                                <>
                                    <Grid item xs={6}>
                                        <TextField
                                            label="Mechanical Share"
                                            value={field.mech_share || ""}
                                            onChange={(e) =>
                                                setValue(`rights.${index}.mech_share`, e.target.value)
                                            }
                                            disabled={!editing}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography>Controlled</Typography>
                                        <Switch
                                            checked={field.is_controlled || false}
                                            onChange={(e) =>
                                                setValue(`rights.${index}.is_controlled`, e.target.checked)
                                            }
                                            disabled={!editing}
                                        />
                                    </Grid>
                                </>
                            )}
                        </Grid>
                        {editing && (
                            <IconButton
                                onClick={() => remove(index)}
                                color="error"
                                size="small"
                                sx={{ mt: 2 }}
                            >
                                <Delete />
                            </IconButton>
                        )}
                    </AccordionDetails>
                </Accordion>
            ))}
            {editing && (
                <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                    <Button variant="contained" startIcon={<Add />} onClick={() => handleAddRight("Publisher Share")}>
                        Add Publisher
                    </Button>
                    <Button variant="contained" startIcon={<Add />} onClick={() => handleAddRight("Writer Share")}>
                        Add Writer
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default PubRightsManagement;
