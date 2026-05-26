import axios from "axios";

export const apiClient = axios.create({
    baseURL: "/api",
    withCredentials: true,
});

// Variable to hold the access token in memory
let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
    accessToken = token;
};

// Request Interceptor: Attach the token to every request
apiClient.interceptors.request.use(
    (config) => {
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

// Response Interceptor: Handle 401 Unauthorized & Refresh Token
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If the error is 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Call the backend refresh endpoint
                const response = await axios.post(
                    "/auth/refresh",
                    {},
                    { withCredentials: true }, // Sends the refresh_token cookie
                );

                const newAccessToken = response.data.accessToken;
                setAccessToken(newAccessToken);

                // Update the failed request with the new token and retry
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                // Refresh token is expired or invalid. Require re-login.
                setAccessToken(null);

                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    },
);
