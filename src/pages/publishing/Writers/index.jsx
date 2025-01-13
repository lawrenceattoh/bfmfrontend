import React, { useState } from "react";
import EntityListPage from "../../EntityListPage.jsx";
import { displaySchema, filterSchema } from "./schema.js"; // Import schemas
import CreateWriterModal from "./CreateWriterModal.jsx"; // Import the modal component

const WriterListPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCreateButtonClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <EntityListPage
                title="Writers"
                endpoint="/writers"
                displaySchema={displaySchema}
                filterSchema={filterSchema}
                dataKey="writers"
                createButton={{
                    label: "Create New Writer",
                    onClick: handleCreateButtonClick,
                }}
            />
            {isModalOpen && <CreateWriterModal onClose={handleCloseModal} />}
        </>
    );
};

export default WriterListPage;
