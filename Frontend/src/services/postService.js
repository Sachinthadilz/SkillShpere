import axios from "axios";

const API_URL = "http://localhost:8081/posts";

export const getPosts = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error in getPosts:', error.message);
        throw error;
    }
};

export const createPost = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/add`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log('Post created:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error in createPost:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
        throw error;
    }
};

export const updatePost = async (postId, formData) => {
    try {
        const response = await axios.put(`${API_URL}/${postId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log('Post updated:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error in updatePost:', error.message);
        throw error;
    }
};

export const deletePost = async (postId) => {
    try {
        await axios.delete(`${API_URL}/${postId}`);
        console.log(`Post with ID ${postId} deleted`);
    } catch (error) {
        console.error('Error in deletePost:', error.message);
        throw error;
    }
};