import React, { useState, useEffect } from "react";
import { makeRequest } from "../../../api/apiClient";
import { ToastContainer, toast } from "react-toastify";
import Select, { components } from "react-select";
import "react-toastify/dist/ReactToastify.css";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import {
  FaChevronDown,
  FaChevronUp,
  FaGlobe,
  FaInfoCircle,
} from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";

const worldMapUrl =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

const regionMapping = {
  asia: "Asia",
  europe: "Europe",
  africa: "Africa",
  northAmerica: "North America",
  southAmerica: "South America",
  oceania: "Oceania",
  antarctica: "Antarctica",
};

const FileUploaderPage = () => {
  const [formData, setFormData] = useState({
    mainCategory: "",
    subCategory: "",
    dealName: "",
    rightType: "",
    isControlled: true,
    thirdPartyAdmin: "",
    reversionDate: "",
  });

  const [deals, setDeals] = useState([]);
  const [dealOptions, setDealOptions] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState(null);

  const rightTypeOptions = {
    publishing: ["Writer Share", "Publisher Share", "Administration"],
    recording: [
      "Recording Ownership",
      "Distribution",
      "Neighboring Rights",
      "Administration",
    ],
  };

  const [countries, setCountries] = useState([]);
  const [groupedCountries, setGroupedCountries] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [expandedContinents, setExpandedContinents] = useState({});

  const [title, setTitle] = useState("Publishing Schedule Import");

  const toggleCountryDropdown = () => setDropdownOpen(!dropdownOpen);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    fetchDeals();
    fetchCountries();
  }, []);

  const fetchDeals = async () => {
    try {
      const { data } = await makeRequest("GET", "/deals");
      setDeals(data.deals || []);
      setDealOptions(
        (data.deals || []).map((deal) => ({
          value: deal.name,
          label: deal.name,
        }))
      );
    } catch (err) {
      toast.error("Error fetching deals.");
      console.error(err);
    }
  };

  const fetchCountries = async () => {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const data = await response.json();

    // Mapping API subregion/region to your desired continent names
    const continentMapping = {
      Asia: "Asia",
      Europe: "Europe",
      Africa: "Africa",
      "North America": "North America",
      "South America": "South America",
      Oceania: "Oceania",
      Antarctica: "Antarctica",
    };

    // Group countries by subregion/region
    const grouped = Object.keys(continentMapping).map((key) => {
      const continentName = continentMapping[key];
      return {
        label: continentName,
        value: continentName,
        options: data
          .filter((country) => {
            // Check both 'region' and 'subregion' for proper mapping
            if (key === "North America") {
              return country.subregion === "North America";
            }
            if (key === "South America") {
              return country.subregion === "South America";
            }
            return country.continents?.includes(key);
          })
          .map((country) => ({
            label: `${country.name.common} (${country.cca2})`,
            value: country.name.common,
          })),
      };
    });

    // Sort the continents based on your desired order
    const desiredOrder = [
      "Worldwide",
      "Asia",
      "Europe",
      "Africa",
      "North America",
      "South America",
      "Oceania",
      "Antarctica",
    ];

    const sortedData = [
      { label: "Worldwide", value: "Worldwide", options: [] }, // Add Worldwide at the top
      ...grouped.sort(
        (a, b) => desiredOrder.indexOf(a.label) - desiredOrder.indexOf(b.label)
      ),
    ];

    setGroupedCountries(sortedData);
    console.log("Grouped Countries:", sortedData); // Debug output
  };

  const toggleContinent = (continent) => {
    setExpandedContinents((prev) => ({
      ...prev,
      [continent]: !prev[continent],
    }));
  };

  const handleContinentSelection = (continent) => {
    const continentCountries = groupedCountries
      .find((group) => group.label === continent)
      ?.options.map((opt) => opt.value);

    const allSelected = continentCountries.every((c) =>
      selectedCountries.includes(c)
    );

    setSelectedCountries((prevSelected) =>
      allSelected
        ? prevSelected.filter((c) => !continentCountries.includes(c))
        : [...new Set([...prevSelected, ...continentCountries])]
    );
  };

  const handleCountryToggle = (countryValue) => {
    setSelectedCountries((prevSelected) =>
      prevSelected.includes(countryValue)
        ? prevSelected.filter((c) => c !== countryValue)
        : [...prevSelected, countryValue]
    );
  };

  const handleToggle = () => {
    setFormData((prev) => ({ ...prev, isControlled: !prev.isControlled }));
  };

  // Custom Value Container to display the selected country count
  const CustomValueContainer = ({ children, ...props }) => {
    const { getValue } = props;
    const selected = getValue();
    return (
      <components.ValueContainer {...props}>
        <div className="flex items-center text-white">
          <FaGlobe className="mr-2" />
          {selected.length > 0
            ? `${selected.length} COUNTRIES SELECTED`
            : "Select countries..."}
        </div>
      </components.ValueContainer>
    );
  };

  const CustomMenuList = (props) => {
    const { options } = props;

    // Check if all countries are selected
    const allCountriesSelected = groupedCountries
      .filter((group) => group.label !== "Worldwide")
      .every((group) =>
        group.options.every((opt) => selectedCountries.includes(opt.value))
      );

    // Handle "Worldwide" toggle
    const handleWorldwideToggle = () => {
      if (allCountriesSelected) {
        setSelectedCountries([]); // Deselect all
      } else {
        const allCountries = groupedCountries
          .filter((group) => group.label !== "Worldwide")
          .flatMap((group) => group.options.map((opt) => opt.value));
        setSelectedCountries(allCountries); // Select all countries
      }
    };

    return (
      <div className="max-h-64 overflow-y-auto">
        {/* Worldwide Checkbox */}
        <div className="flex items-center font-bold p-2 hover:bg-[#1E1E1E] border border-gray-500">
          <input
            type="checkbox"
            className="mr-2"
            checked={allCountriesSelected}
            onChange={handleWorldwideToggle}
          />
          <span>Worldwide</span>
        </div>

        {/* Render Continents and Countries */}
        {options.map((group) => {
          if (group.label === "Worldwide") return null; // Skip rendering "Worldwide" option again

          return (
            <div key={group.label}>
              {/* Continent Header */}
              <div className="flex items-center font-bold p-2 hover:bg-[#1E1E1E] border border-gray-500">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={group.options.every((opt) =>
                    selectedCountries.includes(opt.value)
                  )}
                  onChange={() => handleContinentSelection(group.label)}
                />
                <span>{group.label}</span>
                <span
                  className="ml-auto cursor-pointer"
                  onClick={() => toggleContinent(group.label)}
                >
                  {expandedContinents[group.label] ? (
                    <FaChevronUp />
                  ) : (
                    <FaChevronDown />
                  )}
                </span>
              </div>

              {/* Countries List */}
              {expandedContinents[group.label] &&
                group.options.map((option) => (
                  <div
                    key={option.value}
                    className="ml-6 flex items-center p-1 hover:bg-[#1E1E1E] border border-gray-500"
                  >
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={selectedCountries.includes(option.value)}
                      onChange={() => handleCountryToggle(option.value)}
                    />
                    <span>{option.label}</span>
                  </div>
                ))}
            </div>
          );
        })}
      </div>
    );
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const customStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: "#2c2c2c",
      borderColor: "#555",
      color: "#fff",
    }),
    menu: (base) => ({ ...base, backgroundColor: "#2c2c2c" }),
    option: (base, { isFocused }) => ({
      ...base,
      backgroundColor: isFocused ? "#555" : "transparent",
      color: "#fff",
    }),
  };

  // const handleCountryChange = (selectedOptions) => {
  //   setSelectedCountries(selectedOptions.map((option) => option.value));
  // };
  const handleSubmit = async () => {
    // Define a flag for tracking validation
    let isValid = true;

    // Define an error object to track specific field errors
    const errors = {};

    // Validate each field and update the error object
    if (!formData.mainCategory) {
      isValid = false;
      errors.mainCategory = "Please select a Main Category.";
    }

    if (!formData.subCategory) {
      isValid = false;
      errors.subCategory = "Please select a Sub Category.";
    }

    if (!formData.dealName) {
      isValid = false;
      errors.dealName = "Please select a Deal Name.";
    }

    if (!formData.rightType) {
      isValid = false;
      errors.rightType = "Please select a Right Type.";
    }

    if (!selectedCountries.length) {
      isValid = false;
      errors.territories = "Please select at least one territory.";
    }

    if (!uploadedFile) {
      isValid = false;
      errors.uploadedFile = "Please upload a file.";
    }

    // Check if "Is Controlled" is unchecked and additional fields are required
    if (!formData.isControlled) {
      if (!formData.thirdPartyAdmin) {
        isValid = false;
        errors.thirdPartyAdmin = "Please provide a Third Party Admin.";
      }
      if (!formData.reversionDate) {
        isValid = false;
        errors.reversionDate = "Please provide a Reversion Date.";
      }
    }

    if (!isValid) {
      setFieldErrors(errors); // Save errors for displaying inline
      toast.error("Please fill in all required fields.");
      return;
    }

    // Continue with form submission logic
    const formdata = new FormData();
    formdata.append("file", uploadedFile);
    formdata.append("deal_id", formData.dealName);
    formdata.append("right_type", formData.rightType);
    formdata.append("is_controlled", formData.isControlled ? "true" : "false");
    formdata.append("territories", JSON.stringify(selectedCountries));
    formdata.append("completed_date", formData.reversionDate || "");

    // Set additional fields for publishing or recording
    if (formData.subCategory === "publishing") {
      formdata.append(
        "mech_share",
        formData.autoCalculateMechanical ? "7321" : "0"
      );
      formdata.append("reversion_date", formData.reversionDate || "");
    }

    const endpoint =
      formData.subCategory === "publishing"
        ? "/import/schedule/publishing"
        : "/import/schedule/recordings";

    try {
      const { data, error } = await makeRequest("POST", endpoint, {}, formdata);

      if (!error) {
        toast.success("File uploaded successfully!");
        setTimeout(() => window.location.reload(), 2000);
      } else {
        toast.error(error?.message || "Something went wrong!");
      }
    } catch (err) {
      toast.error("Failed to upload file. Please try again!");
    }

    // In the handleSubmit function, update this part:
    if (!isValid) {
      setFieldErrors(errors); // Save errors for displaying inline
      toast.error("Please fill in all required fields.");
      return;
    }
  };

  // Ensure this function is using `fieldErrors` correctly
  const renderError = (field) => {
    return fieldErrors[field] ? (
      <span className="text-red-500 text-sm">{fieldErrors[field]}</span>
    ) : null;
  };

  const rightTypeMapping = {
    writer_share: "Writer Share",
    publisher_share: "Publisher Share",
    administration: "Administration",
    recording_ownership: "Recording Ownership",
    distribution_rights: "Distribution",
    neighboring_rights: "Neighboring Rights",
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white py-10 px-32 w-full">
      <h1 className="text-3xl font-bold mb-8">File Uploader</h1>

      <div className="mb-6">
        <label
          htmlFor="mainCategory"
          className="block text-gray-400 text-sm mb-2"
        >
          Main Category <span className="text-red-500">*</span>
        </label>
        <div className="relative w-full">
          <select
            id="mainCategory"
            name="mainCategory"
            value={formData.mainCategory}
            onChange={handleInputChange}
            className="w-full bg-[#1E1E1E] border border-gray-500 text-white rounded-md px-4 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>
              Select Main Category
            </option>
            <option value="scheduleOfWork">Schedule of Work</option>
          </select>
          {/* Custom Arrow */}
          <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06 0L10 10.92l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 010-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          {renderError("mainCategory")}
        </div>
      </div>

      {/* Subcategory Dropdown */}
      {/* Sub Category - Render only if Main Category is selected */}
      {formData.mainCategory && (
        <div className="mb-6">
          <label
            htmlFor="subCategory"
            className="block text-gray-400 text-sm mb-2"
          >
            Sub Category <span className="text-red-500">*</span>
          </label>
          <div className="relative w-full">
            <select
              id="subCategory"
              value={formData.subCategory}
              onChange={(e) => {
                const value = e.target.value;
                setFormData({ ...formData, subCategory: value, rightType: "" });
                setTitle(
                  value === "publishing"
                    ? "Publishing Schedule Import"
                    : "Recording Schedule Import"
                );
              }}
              className="w-full bg-[#1E1E1E] border border-gray-500 text-white px-4 py-2 rounded-md appearance-none"
            >
              <option value="" disabled>
                Select Sub Category
              </option>
              <option value="publishing">Publishing</option>
              <option value="recording">Recording</option>
            </select>
            {/* Custom Arrow */}
            <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06 0L10 10.92l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 010-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            {renderError("subCategory")}
          </div>
        </div>
      )}

      {formData.subCategory && (
        <>
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-300">
              Selected Form:
            </h2>
          </div>

          <div className="bg-[#1E1E1E] border border-gray-500 p-6 rounded-lg shadow-inner">
            <h2 className="text-2xl font-semibold text-white mb-4">{title}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Right Type */}
              <div className="mb-6">
                <label className="block text-sm mb-1 flex items-center">
                  Right Type <span className="text-red-500">*</span>{" "} <FaInfoCircle className="ml-1" /> 
                </label>
                <div className="relative w-full">
                  <select
                    value={formData.rightType} // Backend-compatible value stored
                    onChange={(e) => {
                      setFormData({ ...formData, rightType: e.target.value });
                    }}
                    className="w-full bg-[#1E1E1E] border border-gray-500 text-white px-4 py-2 rounded-md appearance-none"
                  >
                    <option value="" disabled>
                      Select Right Type
                    </option>
                    {formData.subCategory === "publishing"
                      ? Object.entries(rightTypeMapping)
                          .filter(([key]) =>
                            [
                              "writer_share",
                              "publisher_share",
                              "administration",
                            ].includes(key)
                          )
                          .map(([key, label]) => (
                            <option key={key} value={key}>
                              {label}
                            </option>
                          ))
                      : Object.entries(rightTypeMapping)
                          .filter(([key]) =>
                            [
                              "recording_ownership",
                              "distribution_rights",
                              "neighboring_rights",
                              "administration",
                            ].includes(key)
                          )
                          .map(([key, label]) => (
                            <option key={key} value={key}>
                              {label}
                            </option>
                          ))}
                  </select>

                  {/* Custom Arrow */}
                  <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06 0L10 10.92l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 010-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  {renderError("rightType")}

                </div>
              </div>

              {/* Deal Name */}
              <div className="mb-6">
                <label className="block text-sm mb-1 flex items-center">
                  Deal Name <span className="text-red-500">*</span>{" "}
                  <FaInfoCircle className="ml-1" />
                </label>
                <div className="relative w-full">
                  <select
                    className="w-full bg-[#1E1E1E] border border-gray-500 text-white px-4 py-2 rounded-md appearance-none"
                    value={formData.dealName}
                    onChange={(e) =>
                      setFormData({ ...formData, dealName: e.target.value })
                    }
                  >
                    <option value="" disabled>
                      Select Deal Name
                    </option>
                    {dealOptions.map((deal) => (
                      <option key={deal.value} value={deal.value}>
                        {deal.label}
                      </option>
                    ))}
                  </select>
                  {/* Custom Arrow */}
                  <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06 0L10 10.92l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 010-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  {renderError("dealName")}
                </div>
              </div>

              {/* Territories Dropdown */}
              <div>
                <label className="block text-sm mb-1 flex items-center">
                  Territories  <span className="text-red-500">*</span>{" "} <FaInfoCircle className="ml-1" />
                </label>
                <Select
                  options={groupedCountries}
                  isMulti
                  components={{
                    MenuList: CustomMenuList, // Keep the existing dropdown UI
                    ValueContainer: CustomValueContainer, // Custom display UI for selected countries
                  }}
                  value={groupedCountries
                    .flatMap((group) => group.options)
                    .filter((option) =>
                      selectedCountries.includes(option.value)
                    )}
                  onChange={(selectedOptions) =>
                    setSelectedCountries(
                      selectedOptions.map((opt) => opt.value)
                    )
                  }
                  closeMenuOnSelect={false}
                  placeholder="Select countries..."
                  styles={{
                    control: (base) => ({
                      ...base,
                      backgroundColor: "#1E1E1E",
                      color: "#fff",
                      borderColor: "#555",
                    }),
                    menu: (base) => ({ ...base, backgroundColor: "#1E1E1E" }),
                    option: (base, { isFocused }) => ({
                      ...base,
                      backgroundColor: isFocused ? "#555" : "transparent",
                      color: "#fff",
                    }),
                  }}
                />
                {renderError("territories")}

              </div>

              {/* Dropdown Content */}
              {dropdownOpen && (
                <div className="absolute mt-1 bg-gray-800 text-white rounded shadow-lg w-full max-h-64 overflow-y-auto z-10">
                  {groupedCountries.map((group) => (
                    <div key={group.label} className="border-b border-gray-700">
                      {/* Continent Header */}
                      <div className="flex items-center justify-between px-4 py-2 font-bold hover:bg-[#1E1E1E] border border-gray-500">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="mr-2"
                            checked={group.options.every((opt) =>
                              selectedCountries.includes(opt.value)
                            )}
                            onChange={() =>
                              handleContinentSelection(group.label)
                            }
                          />
                          {group.label}
                        </label>
                        <span
                          className="cursor-pointer"
                          onClick={() => toggleContinent(group.label)}
                        >
                          {expandedContinents[group.label] ? (
                            <FaChevronUp />
                          ) : (
                            <FaChevronDown />
                          )}
                        </span>
                      </div>

                      {/* Countries List */}
                      {expandedContinents[group.label] &&
                        group.options.map((option) => (
                          <div
                            key={option.value}
                            className="flex items-center px-6 py-1 hover:bg-[#1E1E1E] border border-gray-500"
                          >
                            <input
                              type="checkbox"
                              className="mr-2"
                              checked={selectedCountries.includes(option.value)}
                              onChange={() => handleCountryToggle(option.value)}
                            />
                            <span>{option.label}</span>
                          </div>
                        ))}
                    </div>
                  ))}
                </div>
              )}

              {/* Is Controlled Toggle */}
              <div className="flex items-center">
                <label className="mr-4">Is Controlled (Exclusive/Active)</label>
                <Switch
                  checked={formData.isControlled}
                  onChange={() =>
                    setFormData({
                      ...formData,
                      isControlled: !formData.isControlled,
                    })
                  }
                  color="primary"
                />
              </div>

              {/* Conditional Fields Below Row */}
              {!formData.isControlled && (
                <>
                  <div>
                    <label className="block text-sm mb-1">
                      Third Party Admin <span className="text-red-500">*</span>{" "}
                    </label>
                    <input
                      type="text"
                      value={formData.thirdPartyAdmin}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          thirdPartyAdmin: e.target.value,
                        })
                      }
                      className="w-full bg-[#1E1E1E] border border-gray-500 text-white px-4 py-2 rounded-md"
                    />
                    
                  </div>

                  <div>
                    <label className="block text-sm mb-1">
                      Reversion Date <span className="text-red-500">*</span>{" "}
                    </label>
                    <input
                      type="date"
                      value={formData.reversionDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          reversionDate: e.target.value,
                        })
                      }
                      className="w-full bg-[#1E1E1E] border border-gray-500 text-white px-4 py-2 rounded-md"
                    />
                  </div>
                </>
              )}

              {/* Auto Calculate Mechanical Share Checkbox */}
              {formData.rightType === "publisher_share" && (
                <div className="flex items-center mt-4">
                  <input
                    type="checkbox"
                    id="autoCalculate"
                    checked={formData.autoCalculateMechanical || false}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        autoCalculateMechanical: e.target.checked,
                      })
                    }
                    className="mr-2"
                  />
                  <label htmlFor="autoCalculate" className="text-sm">
                    Auto calculate Mechanical Share?
                  </label>
                </div>
              )}

              {/* Upload Schedule */}
              <div className="col-span-2">
                <label className="block text-sm mb-1 flex items-center">
                  Upload Schedule <span className="text-red-500">*</span>{" "}
                  <FaInfoCircle className="ml-1" />
                </label>
                <div className="border-dashed border-2 border-gray-600 p-4 rounded text-center text-gray-400 relative">
                  {uploadedFile ? (
                    <span>{uploadedFile.name}</span>
                  ) : (
                    <span>Drop a file here or click to upload</span>
                  )}
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-6">
              <button
                className="text-blue-500 hover:text-blue-700"
                onClick={() => {
                  setFormData({
                    mainCategory: "",
                    subCategory: "",
                    dealName: "",
                    rightType: "Recording Ownership",
                    isControlled: true,
                  });
                  setUploadedFile(null);
                  setSelectedCountries([]);
                }}
              >
                Reset
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded text-white"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FileUploaderPage;
