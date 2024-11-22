import React from "react";
import EntityDetailPage from "../../EntityDetailPage.jsx";
import {useNavigate, useParams} from "react-router-dom";

const DealDetailPage = () => {
    const navigate = useNavigate();
    const id = useParams();

    return (
        <EntityDetailPage
            endpoint="/deals"
            dataKey='deals'
            fields={[
                {name: "id", label: "ID", readOnly: true},
                {name: "name", label: "Name"},
                {name: "status", label: "Status"},
            ]}

            onDeleteSuccess={() => navigate("/deals")}
        />
    );
};

export default DealDetailPage;
