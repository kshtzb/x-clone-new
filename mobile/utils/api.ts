import axios, { AxiosInstance } from "axios";
import { useAuth } from "@clerk/clerk-expo";

const API_BASE_URL = "https://x-clone-new.vercel.app/api";

// ⚠️ Note:
// localhost will NOT work on a physical device
// because the phone does not know your computer's localhost
// const API_BASE_URL = "http://localhost:5001/api";

// ------------------------------------------------------------
// Creates a reusable Axios client with authentication support
// ------------------------------------------------------------

// getToken → async function provided by Clerk
// Returns a JWT access token for the logged-in user
// this will basically create an authenticated api, pass the token into our headers
export const createApiCLient = (
  getToken: () => Promise<string | null>
): AxiosInstance => {
  // Create a new Axios instance with a predefined base URL
  const api = axios.create({
    baseURL: API_BASE_URL,
  });

  // Add a request interceptor
  // This runs BEFORE every request is sent
  api.interceptors.request.use(async (config) => {
    // Ask Clerk for the current user's auth token
    const token = await getToken();

    // If user is authenticated, attach token to headers
    if (token) {
      // Authorization header is required for protected backend routes
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Always return the modified config
    return config;
  });

  // Return the configured Axios client
  return api;
};

// ------------------------------------------------------------
// React hook to get a ready-to-use authenticated API client
// ------------------------------------------------------------

export const useApiClient = (): AxiosInstance => {
  // useAuth gives access to Clerk authentication helpers
  const { getToken } = useAuth();

  // Create and return an authenticated Axios client
  return createApiCLient(getToken);
};

// ------------------------------------------------------------
// User-related API calls
// ------------------------------------------------------------

export const userApi = {
  // Creates or syncs the authenticated user in your backend DB
  syncUser: (api: AxiosInstance) => api.post("/users/sync"),

  // Fetches the currently authenticated user's profile
  getCurrentUser: (api: AxiosInstance) => api.get("/users/me"),

  // Updates the user's profile information
  updateProfile: (api: AxiosInstance, data: any) =>
    api.put("/users/profile", data),
};

// ------------------------------------------------------------
// Post-related API calls
// ------------------------------------------------------------

export const postApi = {
  // Creates a new post (text + optional image)
};
