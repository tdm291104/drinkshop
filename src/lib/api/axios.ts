import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { getToken } from "@/src/lib/utils";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE;
console.log("API Base URL:", BASE_URL);

// Create public axios instance (no auth required)
export const publicApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Create private axios instance (auth required)
export const privateApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to private instance to handle auth
privateApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get user data from token
    const userData = getToken();

    if (userData) {
      // Add user info to request headers
      config.headers["X-User-Id"] = userData.id;
      config.headers["X-User-Role"] = userData.role;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to both instances
const responseInterceptor = (response: AxiosResponse) => {
  // Return the actual data from the response
  return response.data;
};

const errorInterceptor = (error: AxiosError) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error("Response Error:", error.response.data);
    return Promise.reject(error.response.data);
  } else if (error.request) {
    // The request was made but no response was received
    console.error("Request Error:", error.request);
    return Promise.reject({ message: "No response from server" });
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error("Error:", error.message);
    return Promise.reject({ message: "Request failed" });
  }
};

// Enhanced error interceptor for private API to handle auth errors
const privateErrorInterceptor = (error: AxiosError) => {
  if (error.response?.status === 401) {
    // Redirect to login page if unauthorized
    window.location.href = "/login";
  }

  // Use the same error handling as the general interceptor
  if (error.response) {
    console.error("Response Error:", error.response.data);
    return Promise.reject(error.response.data);
  } else if (error.request) {
    console.error("Request Error:", error.request);
    return Promise.reject({ message: "No response from server" });
  } else {
    console.error("Error:", error.message);
    return Promise.reject({ message: "Request failed" });
  }
};

publicApi.interceptors.response.use(responseInterceptor, errorInterceptor);
privateApi.interceptors.response.use(
  responseInterceptor,
  privateErrorInterceptor
);
