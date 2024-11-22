import React from "react";
import EntityListPage from "../pages/EntityListPage.jsx";

const schema = [
    {key: "title", label: "Title", displayType: "text", isFilterable: true},
    {key: "iswc", label: "ISWC", displayType: "text", isFilterable: true},
];

const WorksListPage = ({filter}) => {
    const endpoint = "/works"; // API endpoint for works
    const queryParams = {...filter}; // Dynamically filter works for the entity

    return (
        <EntityListPage
            title="Works"
            endpoint={endpoint}
            schema={schema}
            dataKey="works"
            filters={queryParams}
        />
    );
};

export default WorksListPage;
