import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { fetchData, selectApiState } from "../store/apiSlice";

export function TestPage() {
    const dispatch = useDispatch();
    const { loading, data, error } = useSelector(selectApiState);

    useEffect(() => {
        dispatch(fetchData({ endpoint: "deals" }));
    }, [dispatch]);

    // Debugging: Log state to see why multiple calls might happen
    console.log("State:", { loading, data, error });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div>
                {data?.deals?.map((deal, index) => (
                    <div key={index}>{JSON.stringify(deal)}</div>
                ))}
            </div>
        </LocalizationProvider>
    );
}