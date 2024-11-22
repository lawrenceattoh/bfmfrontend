import React from "react";
import EntityListPage from "../../EntityListPage.jsx";
import schema from "./schema.js";

const WorksListPage = () => {
    return (
        <EntityListPage
            title="Works"
            endpoint="/works"
            schema={schema}
            dataKey={'works'}

        />
    );
};

export default WorksListPage;
