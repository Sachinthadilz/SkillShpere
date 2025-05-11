import axios from "axios";

const API_URL = "http://localhost:8080";

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

axiosInstance.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem("JWT_TOKEN");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log("JWT_TOKEN applied:", token.substring(0, 20) + "...");
        } else {
            console.warn("No JWT_TOKEN found in localStorage");
        }

        let csrfToken = null;

        // Try to fetch CSRF token from /api/csrf-token
        try {
            const response = await axios.get(`${API_URL}/api/csrf-token`, {
                withCredentials: true,
            });
            // Handle different possible response formats
            csrfToken = response.data.csrfToken || response.data.token || response.data;
            if (typeof csrfToken === "object") {
                console.warn("Unexpected CSRF token format:", csrfToken);
                csrfToken = null;
            }
            if (csrfToken) {
                console.log("Fetched CSRF token from /api/csrf-token:", csrfToken);
            } else {
                console.warn("No valid CSRF token in /api/csrf-token response:", response.data);
            }
        } catch (error) {
            console.error("Failed to fetch CSRF token from /api/csrf-token:", error.message);
        }

        // Fallback to cookie if /api/csrf-token fails
        if (!csrfToken) {
            console.log("Checking for XSRF-TOKEN cookie");
            const cookieString = document.cookie;
            console.log("Cookies:", cookieString);
            csrfToken = cookieString
                .split("; ")
                .find((row) => row.startsWith("XSRF-TOKEN="))
                ?.split("=")[1];
            if (csrfToken) {
                console.log("Found XSRF-TOKEN cookie:", csrfToken);
            } else {
                console.warn("No XSRF-TOKEN cookie found");
            }
        }

        if (csrfToken) {
            config.headers["X-XSRF-TOKEN"] = csrfToken;
            console.log("Set X-XSRF-TOKEN header:", csrfToken);
        } else {
            console.warn("No CSRF token available");
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export const getPosts = async () => {
    try {
        const response = await axiosInstance.get("/posts");
        return response.data;
    } catch (error) {
        console.error("Error in getPosts:", error.message);
        throw error;
    }
};

export const createPost = async (formData) => {
    try {
        const response = await axiosInstance.post("/posts/add", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        console.log("Post created:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error in createPost:", error.message);
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
        }
        throw error;
    }
};

export const updatePost = async (postId, formData) => {
    try {
        const response = await axiosInstance.put(`/posts/${postId}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        console.log("Post updated:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error in updatePost:", error.message);
        throw error;
    }
};

export const deletePost = async (postId) => {
    try {
        await axiosInstance.delete(`/posts/${postId}`);
        console.log(`Post with ID ${postId} deleted`);
    } catch (error) {
        console.error("Error in deletePost:", error.message);
        throw error;
    }
};


export const getPostsByUser = async (userId) => {
    try {
        const response = await axiosInstance.get(`/posts/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error in getPostsByUser:", error.message);
        throw error;
    }
};

