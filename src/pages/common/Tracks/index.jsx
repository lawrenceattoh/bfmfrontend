import React from "react";
import EntityListPage from "../../EntityListPage.jsx";
import { displaySchema, filterSchema } from "./schema.js"; // Import schema

const TracksListPage = () => {
  return (
    <EntityListPage
      title="Tracks"
      singularTitle="Track" // Add singular title
      endpoint="/tracks" // API endpoint for tracks
      displaySchema={displaySchema}
      filterSchema={filterSchema} // Pass the filter schema
      dataKey="tracks" // Key for tracks in API response
    />
  );
};

export default TracksListPage;
