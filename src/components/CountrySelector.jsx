import React from "react";
import {
    Box,
    Card,
    CardHeader,
    Divider,
    TextField,
    Button,
    Autocomplete,
    ListItemIcon,
    Tooltip,
} from "@mui/material";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import CheckIcon from "@mui/icons-material/Check";
import { regions, countryOptions } from "../data/countries";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-50m.json";

const CountrySelector = ({ onChange }) => {
    const [selectedCountries, setSelectedCountries] = React.useState([]);
    const [searchValue, setSearchValue] = React.useState("");

    const handleCountryChange = (event, newValue) => {
        if (newValue) {
            const isSelected = selectedCountries.some(
                (country) => country.id === newValue.id
            );
            if (isSelected) {
                const updatedCountries = selectedCountries.filter(
                    (country) => country.id !== newValue.id
                );
                setSelectedCountries(updatedCountries);
                onChange(updatedCountries); // Notify parent
            } else {
                const updatedCountries = [...selectedCountries, newValue];
                setSelectedCountries(updatedCountries);
                onChange(updatedCountries); // Notify parent
            }
        }
        setSearchValue("");
    };

    const selectAll = () => {
        setSelectedCountries(countryOptions);
        onChange(countryOptions); // Notify parent
    };

    const addRegion = (regionCodes) => {
        const newCountries = countryOptions.filter((c) =>
            regionCodes.includes(c.value)
        );
        const uniqueCountries = [
            ...new Set([...selectedCountries, ...newCountries]),
        ];
        setSelectedCountries(uniqueCountries);
        onChange(uniqueCountries); // Notify parent
    };

    const deselectAll = () => {
        setSelectedCountries([]);
        onChange([]); // Notify parent
    };

    return (
        <Box sx={{ display: "flex", gap: 2, flexDirection: "row-reverse" }}>
            {/* Quick Select Options */}
            <Box sx={{ width: "20%", minWidth: 180, paddingTop: 3 }}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        mt: "52px",
                    }}
                >
                    <Button
                        onClick={selectAll}
                        variant="contained"
                        size="small"
                        sx={{ backgroundColor: "black" }}
                    >
                        Worldwide
                    </Button>
                    {Object.entries(regions).map(([region, codes]) => (
                        <Button
                            key={region}
                            onClick={() => addRegion(codes)}
                            variant="contained"
                            size="small"
                            sx={{ backgroundColor: "black" }}
                        >
                            {region}
                        </Button>
                    ))}
                    <Button
                        onClick={deselectAll}
                        variant="contained"
                        size="small"
                        sx={{ backgroundColor: "black" }}
                    >
                        Deselect All
                    </Button>
                </Box>
            </Box>

            {/* Country Selector */}
            <Card
                sx={{
                    flex: 1,
                    height: 600,
                    borderRadius: 2,
                    boxShadow: 2,
                    bgcolor: "background.paper",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <CardHeader
                    title={
                        <Box sx={{ width: "100%" }}>
                            <Autocomplete
                                options={countryOptions}
                                getOptionLabel={(option) =>
                                    `${option.flag} ${option.label}`
                                }
                                value={null}
                                onChange={handleCountryChange}
                                inputValue={searchValue}
                                onInputChange={(event, newValue) =>
                                    setSearchValue(newValue)
                                }
                                renderOption={(props, option) => {
                                    const isSelected = selectedCountries.some(
                                        (country) => country.id === option.id
                                    );
                                    return (
                                        <li
                                            {...props}
                                            key={option.id}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                            onMouseDown={(e) =>
                                                e.preventDefault()
                                            }
                                        >
                                            <ListItemIcon
                                                sx={{
                                                    visibility: isSelected
                                                        ? "visible"
                                                        : "hidden",
                                                    marginRight: 1,
                                                }}
                                            >
                                                <CheckIcon color="primary" />
                                            </ListItemIcon>
                                            {option.flag} {option.label}
                                        </li>
                                    );
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="outlined"
                                        placeholder="Search countries..."
                                        size="small"
                                    />
                                )}
                                size="small"
                                disableCloseOnSelect
                            />
                        </Box>
                    }
                    sx={{ p: 1.5, pb: 0 }}
                />
                <Divider sx={{ my: 1 }} />

                {/* Map with Highlighted Countries */}
                <Box sx={{ flex: 1, position: "relative" }}>
                    <ComposableMap
                        projectionConfig={{ scale: 140 }}
                        style={{ width: "100%", height: "100%" }}
                    >
                        <Geographies geography={geoUrl}>
                            {({ geographies }) =>
                                geographies.map((geo) => {
                                    const isSelected = selectedCountries.some(
                                        (country) => country.id === geo.id
                                    );
                                    const countryName = countryOptions.find(
                                        (country) => country.id === geo.id
                                    )?.label;
                                    return (
                                        <Tooltip
                                            key={geo.rsmKey}
                                            title={countryName}
                                            placement="top"
                                            arrow
                                        >
                                            <Geography
                                                geography={geo}
                                                fill={isSelected ? "#FF5722" : "#D6D6DA"}
                                                stroke="#FFFFFF"
                                                style={{
                                                    default: { outline: "none" },
                                                    hover: { outline: "none" },
                                                    pressed: { outline: "none" },
                                                }}
                                            />
                                        </Tooltip>
                                    );
                                })
                            }
                        </Geographies>
                    </ComposableMap>
                </Box>
            </Card>
        </Box>
    );
};

CountrySelector.defaultProps = {
    onChange: () => {}, // Default no-op if no prop is provided
};

export default CountrySelector;
