import React from "react";
import EntityListPage from "../../EntityListPage.jsx";
import schema from "./schema.js";

const WriterListPage = () => {
    return (
        <EntityListPage
            title="Writers"
            endpoint="/writers"
            schema={schema}
            dataKey={'writers'}

        />
    );
};

export default WriterListPage;
