import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import EntityDetailPage from "../../EntityDetailPage";
import EntityListPage from "../../EntityListPage";

const WriterDetailPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const tabsConfig = [
        {
            label: "Works",
            component: (
                <EntityListPage
                    title="Works"
                    endpoint={`/writers/${id}/works`}
                    schema={[
                        { key: "id", label: "ID" },
                        { key: "name", label: "Title" },
                        { key: "status", label: "Status" },
                    ]}
                    dataKey="works"
                    // filters={{ writer_id: id }}
                />
            ),
        },
    ];

    return (
        <EntityDetailPage
            endpoint="/writers"
            entityId={id}
            fields={[
                { name: "id", label: "ID", readOnly: true },
                { name: "name", label: "Name" },
                { name: "alias", label: "Alias" },
                { name: "ipi", label: "IPI" },
                { name: "status", label: "Status" },
            ]}
            tabsConfig={tabsConfig}
            onDeleteSuccess={() => navigate("/writers")}
        />
    );
};

export default WriterDetailPage;
