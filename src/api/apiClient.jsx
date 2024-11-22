import axios from "axios";
import store from "../store";
import { selectUser } from "../store/userSlice";
import { getCurrentToken } from "../services/authService";

const BASE_URL = "http://localhost:8000/api/v1";

const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add dynamic headers with interceptors
apiClient.interceptors.request.use(
    async (config) => {
        const state = store.getState();
        const user = selectUser(state);

        // Use token from Redux or refresh if necessary
        let token = user?.token;
        if (!token) {
            token = await getCurrentToken(); // Refresh and cache token if needed
        }

        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }

        if (user?.uid) {
            config.headers["RMS-User"] = user.uid;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API Error:", error.response?.data || error.message);
        return Promise.reject(error.response?.data || error.message);
    }
);

// Utility to make API requests
export const makeRequest = async (method, endpoint, params = {}, data = {}, pagination = {}) => {
    try {
        const queryParams = { ...pagination, ...params };
        const response = await apiClient({
            method,
            url: endpoint,
            params: queryParams,
            data,
        });
        return { data: response.data, error: null };
    } catch (error) {
        return { data: null, error };
    }
};

export default apiClient;