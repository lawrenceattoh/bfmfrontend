import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, List, ListItem, ListItemText } from "@mui/material";
import { makeRequest } from "../api/apiClient";

const DealsList = ({ entityId }) => {
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDeals = async () => {
            const { data, error } = await makeRequest("GET", `/deals?writerId=${entityId}`);
            if (!error) setDeals(data.deals || []);
            setLoading(false);
        };
        fetchDeals();
    }, [entityId]);

    if (loading) return <CircularProgress />;

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Linked Deals
            </Typography>
            {deals.length === 0 ? (
                <Typography>No deals found for this entity.</Typography>
            ) : (
                <List>
                    {deals.map((deal) => (
                        <ListItem key={deal.id}>
                            <ListItemText
                                primary={`Deal ID: ${deal.id}`}
                                secondary={`Status: ${deal.status}`}
                            />
                        </ListItem>
                    ))}
                </List>
            )}
        </Box>
    );
};

export default DealsList;
