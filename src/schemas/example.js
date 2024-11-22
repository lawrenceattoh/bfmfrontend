export const formSchema = {
    endpoint: "/api/resource", // API endpoint for GET/PATCH/POST
    method: "PATCH", // HTTP method
    fields: [
        {
            name: "username",
            type: "text",
            label: "Username",
            placeholder: "Enter your username",
            validation: {
                required: "Username is required",
                minLength: {value: 3, message: "Minimum 3 characters"},
            },
        },
        {
            name: "email",
            type: "email",
            label: "Email",
            placeholder: "Enter your email",
            validation: {
                required: "Email is required",
                pattern: {
                    value: /^[^@]+@[^@]+\.[^@]+$/,
                    message: "Invalid email format",
                },
            },
        },
        {
            name: "status",
            type: "switch",
            label: "Active Status",
            defaultValue: true,
        },
        {
            name: "role",
            type: "autocomplete",
            label: "Role",
            fetchOptions: "/api/roles", // API for fetching options
        },
        {
            name: "birthdate",
            type: "date",
            label: "Birthdate",
            validation: {
                required: "Birthdate is required",
            },
        },
    ],
};
