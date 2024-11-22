import React from 'react';
import { Box, Tooltip } from '@mui/material';

// Define the colors for each rights type
const colors = {
    "Publisher Share": "rgb(247, 151, 103)", // Orange
    "Writer Share": "rgb(76, 142, 218)", // Blue
};


const RightsTypeIndicator = ({ publishers = [], writers = [] }) => {
    // Determine if the rights apply
    const bellaFiguraIPI = "1133481777";

    const hasPublisherShare = publishers.some(pub => pub.ipi === bellaFiguraIPI);
    const hasWriterShare = writers.length > 0;

    // Create an array of applicable rights types
    const rightsTypes = [];
    if (hasPublisherShare) rightsTypes.push("Publisher Share");
    if (hasWriterShare) rightsTypes.push("Writer Share");

    return (
        <Box sx={{ display: "flex", gap: 1 }}>
            {rightsTypes.map((type, index) => (
                <Tooltip key={index} title={type}>
                    <Box
                        sx={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            backgroundColor: colors[type] || "gray",
                        }}
                    />
                </Tooltip>
            ))}
        </Box>
    );
};

export default RightsTypeIndicator;
