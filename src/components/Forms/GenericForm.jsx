import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Switch, Autocomplete, Button } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useDispatch } from "react-redux"; // Redux Integration
import { debounce } from "lodash"; // For debounced searches
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const GenericForm = ({ schema }) => {
    const [defaultValues, setDefaultValues] = useState({});
    const [optionsCache, setOptionsCache] = useState({});
    const dispatch = useDispatch();

    const validationSchema = yup.object(
        schema.fields.reduce((acc, field) => {
            if (field.validation) {
                acc[field.name] = yup.mixed().concat(yup.object(field.validation));
            }
            return acc;
        }, {})
    );

    const {
        control,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues,
        resolver: yupResolver(validationSchema),
    });

    // Fetch default values if needed
    useEffect(() => {
        if (schema.method === "GET" || schema.method === "PATCH") {
            fetch(schema.endpoint)
                .then((res) => res.json())
                .then((data) => setDefaultValues(data));
        }
    }, [schema.endpoint, schema.method]);

    const fetchOptions = async (url, query = "") => {
        const queryParam = query ? `?search=${query}` : "";
        const fullUrl = `${url}${queryParam}`;

        if (optionsCache[fullUrl]) return optionsCache[fullUrl];

        const response = await fetch(fullUrl);
        const data = await response.json();

        setOptionsCache((prev) => ({ ...prev, [fullUrl]: data }));
        return data;
    };

    // Debounced search function
    const debouncedFetchOptions = debounce(fetchOptions, 500);

    const renderField = (field) => {
        switch (field.type) {
            case "text":
            case "email":
                return (
                    <Controller
                        name={field.name}
                        control={control}
                        render={({ field: inputProps }) => (
                            <TextField
                                {...inputProps}
                                label={field.label}
                                placeholder={field.placeholder}
                                error={!!errors[field.name]}
                                helperText={errors[field.name]?.message}
                                fullWidth
                            />
                        )}
                    />
                );
            case "switch":
                return (
                    <Controller
                        name={field.name}
                        control={control}
                        render={({ field: switchProps }) => (
                            <Switch
                                {...switchProps}
                                checked={watch(field.name)}
                                onChange={(e) => setValue(field.name, e.target.checked)}
                            />
                        )}
                    />
                );
            case "autocomplete":
                return (
                    <Controller
                        name={field.name}
                        control={control}
                        render={({ field: autoProps }) => (
                            <Autocomplete
                                {...autoProps}
                                options={optionsCache[field.fetchOptions] || []}
                                getOptionLabel={(option) => option.name || ""}
                                onChange={(e, selectedOption) => {
                                    setValue(field.name, selectedOption?.id || null);
                                }}
                                onInputChange={(_, value) => {
                                    debouncedFetchOptions(field.fetchOptions, value);
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label={field.label}
                                        placeholder={field.placeholder}
                                        error={!!errors[field.name]}
                                        helperText={errors[field.name]?.message}
                                    />
                                )}
                            />
                        )}
                    />
                );
            case "date":
                return (
                    <Controller
                        name={field.name}
                        control={control}
                        render={({ field: dateProps }) => (
                            <DatePicker
                                {...dateProps}
                                label={field.label}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        error={!!errors[field.name]}
                                        helperText={errors[field.name]?.message}
                                    />
                                )}
                            />
                        )}
                    />
                );
            case "file":
                return (
                    <Controller
                        name={field.name}
                        control={control}
                        render={({ field: fileProps }) => (
                            <TextField
                                {...fileProps}
                                type="file"
                                label={field.label}
                                inputProps={{ accept: field.accept || "*" }}
                                error={!!errors[field.name]}
                                helperText={errors[field.name]?.message}
                                fullWidth
                            />
                        )}
                    />
                );
            default:
                return null;
        }
    };

    const onSubmit = (data) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (key === "file" && value instanceof FileList) {
                formData.append(key, value[0]);
            } else {
                formData.append(key, value);
            }
        });

        fetch(schema.endpoint, {
            method: schema.method,
            body: formData,
        })
            .then((res) => res.json())
            .then((result) => {
                console.log("Submission successful:", result);
                // Optional Redux dispatch
                dispatch({ type: "FORM_SUBMIT_SUCCESS", payload: result });
            });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {schema.fields.map((field) => (
                <div key={field.name} style={{ marginBottom: "16px" }}>
                    {renderField(field)}
                </div>
            ))}
            <Button type="submit" variant="contained" color="primary">
                Submit
            </Button>
        </form>
    );
};

export default GenericForm;