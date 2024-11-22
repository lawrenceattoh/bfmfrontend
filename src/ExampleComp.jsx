import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {fetchData, selectApiState} from "./store/apiSlice";
import {Box, CircularProgress, Typography, Button} from "@mui/material";

const ExampleComponent = () => {
    const dispatch = useDispatch();
    const {loading, data, error} = useSelector(selectApiState);
    const [offset, setOffset] = useState(0);
    const [limit, setLimit] = useState(8)
    const [order, setOrder] = useState('asc');
    const [queryParams, setQueryParams] = useState({});

    useEffect(() => {
        dispatch(fetchData({endpoint: "/writers", pagination: {limit: limit, offset: offset, order: order}}));
    }, [dispatch]);

    const handlePostData = () => {
        dispatch(
            fetchData({
                endpoint: "/writers",
                method: "POST",
                data: {key: "value"},
            })
        );
    };

    return (
        <Box>
            {loading && <CircularProgress/>}
            {error && <Typography color="error">{error}</Typography>}
            {data && (
                <Box>
                    <Typography>Data:</Typography>
                    <pre>{JSON.stringify(data, null, 2)}</pre>
                </Box>
            )}
            <Button variant="contained" onClick={handlePostData}>
                Post Data
            </Button>
        </Box>
    );
};

export default ExampleComponent;
