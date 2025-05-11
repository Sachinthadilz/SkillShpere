import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../../services/postService"; // Adjust the import path as necessary

const PostForm = () => {
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                alert("File size exceeds 10MB limit.");
                return;
            }
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("description", description);
            if (image) {
                formData.append("image", image);
            }

            await createPost(formData);
            navigate("/"); // Navigate back to PostList
        } catch (error) {
            console.error('Failed to add post:', error);
            if (error.response?.status === 413) {
                alert('File too large. Maximum size is 10MB.');
            } else {
                alert('Error adding post. Check the console for details.');
            }
        }
    };

    return (
        <div className="bg-white p-4 shadow-md rounded-xl w-full max-w-lg mx-auto mt-6">
            <form onSubmit={handleSubmit} className="flex flex-col w-full">
                <textarea
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="What's on your mind?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="2"
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mt-2"
                />
                {preview && (
                    <div className="mt-2">
                        <img
                            src={preview}
                            alt="Preview"
                            className="max-w-full h-auto rounded-lg"
                        />
                    </div>
                )}
                <button
                    type="submit"
                    className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg transition"
                >
                    Post
                </button>
            </form>
        </div>
    );
};

export default PostForm;