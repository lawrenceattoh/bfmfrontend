export const schema = {
    method: "POST",
    endpoint: "https://your-api-endpoint.com/upload", // Replace with your endpoint
    fields: [
        {
            name: "deal_name",
            type: "text",
            label: "Deal Name",
            placeholder: "Enter the deal name",
            validation: {required: "Deal name is required"},
        },
        {
            name: "completed_date",
            type: "date",
            label: "Completed Date",
            validation: {required: "Completion date is required"},
        },
        {
            name: "right_type",
            type: "text",
            label: "Right Type",
            placeholder: "Enter the right type",
            validation: {required: "Right type is required"},
        },
        {
            name: "business_group",
            type: "autocomplete",
            label: "Business Group",
            fetchOptions: "https://your-api-endpoint.com/business-groups",
            placeholder: "Select a business group",
            validation: {required: "Business group is required"},
        },
        {
            name: "file",
            type: "file",
            label: "Upload File",
            validation: {required: "File upload is required"},
        },
    ],
};