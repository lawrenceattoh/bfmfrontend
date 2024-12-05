// schema.js
export const displaySchema = [
    { key: "entity_id", label: "ID", displayType: "text" },
    { key: "name", label: "Name", displayType: "text" },
    { key: "created_by", label: "Created By", displayType: "text" },
    { key: "created_at", label: "Created At", displayType: "date" },
  ];
  
  export const filterSchema = [
    { key: "entity_id", label: "ID", isFilterable: true },
    { key: "name", label: "Name", isFilterable: true },
    { key: "created_by", label: "Created By", isFilterable: true },
  ];
  