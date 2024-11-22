import React, {useState, useEffect} from "react";
import {Autocomplete, TextField, CircularProgress} from "@mui/material";
import {debounce} from "lodash";
import apiClient from "../api/apiClient";

const AutoComplete = ({label, apiEndpoint, defaultValue, onChange}) => {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [inputValue, setInputValue] = useState("");

    const fetchOptions = async (query = "") => {
        setLoading(true);
        try {
            const {data} = await apiClient(apiEndpoint, "GET", {query});
            setOptions(data || []);
        } catch (error) {
            console.error("Error fetching options:", error);
        } finally {
            setLoading(false);
        }
    };

    const debouncedFetchOptions = debounce(fetchOptions, 300);

    useEffect(() => {
        fetchOptions(); // Prefetch data on load
    }, []);

    useEffect(() => {
        if (inputValue) debouncedFetchOptions(inputValue);
    }, [inputValue]);

    return (
        <Autocomplete
            options={options}
            getOptionLabel={(option) => option?.name || ""}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            defaultValue={defaultValue}
            onInputChange={(event, value) => setInputValue(value)}
            onChange={(event, value) => onChange(value)}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    variant="outlined"
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {loading && <CircularProgress color="inherit" size={20}/>}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
        />
    );
};

export default AutoComplete;

