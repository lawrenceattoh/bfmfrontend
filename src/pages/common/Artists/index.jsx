import React from "react";
import EntityListPage from "../../EntityListPage.jsx";
import { displaySchema, filterSchema } from "./schema.js"; // Correctly import schemas

const ArtistListPage = () => {
    return (
        <EntityListPage
            title="Artists"
            endpoint="/artists"
            displaySchema={displaySchema} // Pass the display schema
            filterSchema={filterSchema} // Pass the filter schema
            dataKey="artists"
        />
    );
};

export default ArtistListPage;
