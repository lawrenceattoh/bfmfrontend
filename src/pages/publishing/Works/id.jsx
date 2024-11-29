import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    CircularProgress,
    IconButton,
    Tooltip,
    Autocomplete,
    Switch,
} from "@mui/material";
import { Lock, LockOpen, Add, Delete } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import CountrySelector from "../../../components/CountrySelector";
import { makeRequest } from "../../../api/apiClient";

const WorkDetailPage = () => {
    const { id } = useParams();

    const [work, setWork] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [writers, setWriters] = useState([]);
    const [publishers, setPublishers] = useState([]);
    const [deals, setDeals] = useState([]);
    const [selectedTerritories, setSelectedTerritories] = useState([]);

    useEffect(() => {
        const fetchWork = async () => {
            setLoading(true);
            const { data, error } = await makeRequest("GET", `/works/${id}`);
            if (!error) {
                setWork(data);
                setSelectedTerritories(
                    data.territories?.map((country) => ({
                        label: country,
                        value: country,
                    })) || []
                );
            }
            setLoading(false);
        };

        fetchWork();
    }, [id]);

    useEffect(() => {
        const fetchOptions = async () => {
            const [writersRes, publishersRes, dealsRes] = await Promise.all([
                makeRequest("GET", "/api/search/artist", { q: "pop", limit: 10, offset: 0, order: "asc" }),
                makeRequest("GET", "/publishers"),
                makeRequest("GET", "/deals"),
            ]);

            if (!writersRes.error) setWriters(writersRes.data.writers || []);
            if (!publishersRes.error) setPublishers(publishersRes.data.publishers || []);
            if (!dealsRes.error) setDeals(dealsRes.data.deals || []);
        };

        fetchOptions();
    }, []);

    const handleTerritoryChange = (selectedOptions) => {
        setSelectedTerritories(selectedOptions);
    };

    const toggleEditing = () => {
        setEditing((prev) => !prev);
    };

    const handleSave = async () => {
        setSaving(true);

        const payload = {
            ...work,
            territories: selectedTerritories.map((t) => t.value),
        };

        const { error } = await makeRequest("PATCH", `/works/${id}`, {}, payload);

        setSaving(false);
        if (!error) {
            setEditing(false);
            setWork(payload); // Update local state
        }
    };

    const handleAddRight = (type) => {
        const newRight = {
            id: "",
            name: "",
            share: 0,
            ipi: "",
            internal_ip_ref: "",
            deal_id: "",
            mech_share: type === "Publisher Share" ? 0 : undefined,
            is_controlled: type === "Publisher Share" ? false : undefined,
            business_group: "",
        };

        if (type === "Publisher Share") {
            setWork((prev) => ({
                ...prev,
                publishers: [...prev.publishers, newRight],
            }));
        } else {
            setWork((prev) => ({
                ...prev,
                writers: [...prev.writers, newRight],
            }));
        }
    };

    const handleRemoveRight = (type, index) => {
        if (type === "Publisher Share") {
            setWork((prev) => ({
                ...prev,
                publishers: prev.publishers.filter((_, i) => i !== index),
            }));
        } else {
            setWork((prev) => ({
                ...prev,
                writers: prev.writers.filter((_, i) => i !== index),
            }));
        }
    };

    const handleControlledToggle = (index, value) => {
        const updatedPublishers = [...work.publishers];
        updatedPublishers[index].is_controlled = value;
        if (value) {
            updatedPublishers[index].mech_share = updatedPublishers[index].share * 2;
        }
        setWork((prev) => ({ ...prev, publishers: updatedPublishers }));
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" fontWeight={600}>
                    Work Details
                </Typography>
                <Tooltip title={editing ? "Lock" : "Unlock to edit"}>
                    <IconButton onClick={toggleEditing}>
                        {editing ? <LockOpen /> : <Lock />}
                    </IconButton>
                </Tooltip>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={6}>
                    <TextField
                        label="Name"
                        name="name"
                        value={work.name || ""}
                        onChange={(e) => setWork((prev) => ({ ...prev, name: e.target.value }))}
                        disabled={!editing}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="ISWC"
                        name="iswc"
                        value={work.iswc || ""}
                        onChange={(e) => setWork((prev) => ({ ...prev, iswc: e.target.value }))}
                        disabled={!editing}
                        fullWidth
                    />
                </Grid>
            </Grid>

            <Box mt={4}>
                <Typography variant="h6">Publishers</Typography>
                {work.publishers.map((pub, index) => (
                    <Grid container spacing={2} key={index}>
                        <Grid item xs={6}>
                            <Autocomplete
                                options={deals}
                                getOptionLabel={(option) => option.name || ""}
                                value={deals.find((deal) => deal.id === pub.deal_id) || null}
                                onChange={(e, newValue) => {
                                    const updated = [...work.publishers];
                                    updated[index].deal_id = newValue?.id || "";
                                    updated[index].business_group = newValue?.business_group || "";
                                    setWork((prev) => ({ ...prev, publishers: updated }));
                                }}
                                renderInput={(params) => (
                                    <TextField {...params} label="Deal Name" disabled={!editing} />
                                )}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Business Group"
                                value={pub.business_group || ""}
                                disabled
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Publisher Name"
                                value={pub.name || ""}
                                disabled
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="IPI"
                                value={pub.ipi || ""}
                                disabled
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                label="Share (%)"
                                value={pub.share || ""}
                                onChange={(e) => {
                                    const updated = [...work.publishers];
                                    updated[index].share = parseFloat(e.target.value) || 0;
                                    setWork((prev) => ({ ...prev, publishers: updated }));
                                }}
                                disabled={!editing}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                label="Mechanical Share (%)"
                                value={pub.mech_share || ""}
                                onChange={(e) => {
                                    const updated = [...work.publishers];
                                    updated[index].mech_share = parseFloat(e.target.value) || 0;
                                    setWork((prev) => ({ ...prev, publishers: updated }));
                                }}
                                disabled={!editing}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <Switch
                                checked={pub.is_controlled || false}
                                onChange={(e) => handleControlledToggle(index, e.target.checked)}
                                disabled={!editing}
                            />
                            Controlled
                        </Grid>
                        {editing && (
                            <Grid item xs={3}>
                                <IconButton
                                    color="error"
                                    onClick={() => handleRemoveRight("Publisher Share", index)}
                                >
                                    <Delete />
                                </IconButton>
                            </Grid>
                        )}
                    </Grid>
                ))}

                {editing && (
                    <Button
                        variant="outlined"
                        startIcon={<Add />}
                        onClick={() => handleAddRight("Publisher Share")}
                        sx={{ mt: 2 }}
                    >
                        Add Publisher
                    </Button>
                )}
            </Box>

            <Box mt={4}>
                <Typography variant="h6">Writers</Typography>
                {work.writers.map((writer, index) => (
                    <Grid container spacing={2} key={index}>
                        <Grid item xs={6}>
                            <TextField
                                label="Writer Name"
                                value={writer.name || ""}
                                disabled
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="IPI"
                                value={writer.ipi || ""}
                                disabled
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Share (%)"
                                value={writer.share || ""}
                                onChange={(e) => {
                                    const updated = [...work.writers];
                                    updated[index].share = parseFloat(e.target.value) || 0;
                                    setWork((prev) => ({ ...prev, writers: updated }));
                                }}
                                disabled={!editing}
                                fullWidth
                            />
                        </Grid>
                        {editing && (
                            <Grid item xs={3}>
                                <IconButton
                                    color="error"
                                    onClick={() => handleRemoveRight("Writer Share", index)}
                                >
                                    <Delete />
                                </IconButton>
                            </Grid>
                        )}
                    </Grid>
                ))}

                {editing && (
                    <Button
                        variant="outlined"
                        startIcon={<Add />}
                        onClick={() => handleAddRight("Writer Share")}
                        sx={{ mt: 2 }}
                    >
                        Add Writer
                    </Button>
                )}
            </Box>

            <Box mt={4}>
                <Typography variant="h6">Territory Selection</Typography>
                <CountrySelector
                    selectedTerritories={selectedTerritories}
                    onChange={handleTerritoryChange}
                    disabled={!editing}
                />
            </Box>

            {editing && (
                <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
                    <Button variant="outlined" onClick={() => setEditing(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? <CircularProgress size={24} /> : "Save"}
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default WorkDetailPage;
