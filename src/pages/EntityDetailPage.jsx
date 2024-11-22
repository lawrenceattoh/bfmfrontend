import React, {useEffect, useState} from "react";
import {Box, Typography, TextField, Button, CircularProgress, Tabs, Tab} from "@mui/material";
import {makeRequest} from "../api/apiClient";

const EntityDetailPage = ({endpoint, entityId, fields, tabsConfig, onDeleteSuccess}) => {
    const [entity, setEntity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        const fetchEntity = async () => {
            const {data, error} = await makeRequest("GET", `${endpoint}/${entityId}`);
            if (!error) setEntity(data);
            setLoading(false);
        };
        fetchEntity();
    }, [endpoint, entityId]);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setEntity((prev) => ({...prev, [name]: value}));
    };

    const handleSave = async () => {
        setSaving(true);
        const {data, error} = await makeRequest("PATCH", `${endpoint}/${entityId}`, {}, entity);
        setSaving(false);
        if (!error) setEntity(data);
    };

    const handleDelete = async () => {
        const {error} = await makeRequest("DELETE", `${endpoint}/${entityId}`);
        if (!error && onDeleteSuccess) onDeleteSuccess();
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    if (loading) return <CircularProgress/>;

    return (
        <Box sx={{p: 4}}>
            <Typography variant="h5" gutterBottom>
                Entity Detail
            </Typography>
            <Box component="form" sx={{display: "flex", flexDirection: "column", gap: 2, mt: 2}}>
                {fields.map((field) => (
                    <TextField
                        key={field.name}
                        name={field.name}
                        label={field.label}
                        value={entity[field.name] || ""}
                        onChange={handleInputChange}
                        disabled={field.readOnly}
                        fullWidth
                    />
                ))}
                <Box sx={{display: "flex", gap: 2}}>
                    <Button variant="contained" color="primary" onClick={handleSave} disabled={saving}>
                        {saving ? "Saving..." : "Save"}
                    </Button>
                    <Button variant="contained" color="error" onClick={handleDelete}>
                        Delete
                    </Button>
                </Box>
            </Box>

            {tabsConfig && tabsConfig.length > 0 && (
                <Box sx={{mt: 4}}>
                    <Tabs value={activeTab} onChange={handleTabChange}>
                        {tabsConfig.map((tab, index) => (
                            <Tab key={index} label={tab.label}/>
                        ))}
                    </Tabs>
                    <Box sx={{mt: 2}}>
                        {tabsConfig[activeTab]?.component}
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default EntityDetailPage;
