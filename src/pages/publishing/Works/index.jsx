import React, { useState } from "react";
import EntityListPage from "../../EntityListPage.jsx";
import { displaySchema, filterSchema } from "./schema.js"; // Correctly import schemas

const WorksListPage = () => {
  return (
    <>
      <EntityListPage
        title="Works"
        endpoint="/works"
        displaySchema={displaySchema} // Pass the display schema
        filterSchema={filterSchema} // Pass the filter schema
        dataKey="works"
      />
    </>
  );
};

export default WorksListPage;
