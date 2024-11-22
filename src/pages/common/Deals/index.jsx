import React from "react";
import EntityListPage from "../../EntityListPage.jsx";
import dealsSchema from "./schema.js";

const DealsListPage = () => {
    return (
        <EntityListPage
            title="Deals"
            endpoint="/deals"
            dataKey={'deals'}
            schema={dealsSchema}
        />
    );
};

export default DealsListPage;
