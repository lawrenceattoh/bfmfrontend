import React from "react";
import EntityListPage from "../../EntityListPage.jsx";
import { displaySchema, filterSchema } from "./schema.js"; // Import filter schema

const BusinessEntitiesListPage = () => {
  return (
    <EntityListPage
      title="Business Entities"
      singularTitle="Business Entity" // Add singular title
      endpoint="/business-entities"
      displaySchema={displaySchema}
      filterSchema={filterSchema} // Pass the filter schema
      dataKey="businessEntities"
    />
  );
};

export default BusinessEntitiesListPage;
