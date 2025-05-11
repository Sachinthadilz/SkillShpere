import React, { useEffect, useState } from "react";
import { getPostsByUser } from "../../services/postService";
import { useNavigate } from "react-router-dom";

const UserPosts = ({ userId }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (userId) {
            const fetchPosts = async () => {
                try {
                    setLoading(true);
                    setError(null);
                    const data = await getPostsByUser(userId);
                    setPosts(data || []);
                } catch (err) {
                    if (err.response?.status === 401) {
                        setError("Please log in to view these posts.");
                    } else {
                        setError("Failed to load posts. Please try again.");
                    }
                    setPosts([]);
                } finally {
                    setLoading(false);
                }
            };
            fetchPosts();
        }
    }, [userId]);

    if (!userId) {
        return <p className="text-gray-500 text-center">No user selected.</p>;
    }

    return (
        <div className="mt-6">
            {loading && (
                <div className="text-center py-8">
                    <div className="w-8 h-8 mx-auto border-4 border-indigo-600 dark:border-indigo-400 rounded-full border-t-transparent animate-spin"></div>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">Loading posts...</p>
                </div>
            )}
            {error && (
                <div className="text-center py-8">
                    <p className="text-red-600 dark:text-red-400">{error}</p>
                    <div className="mt-4 flex justify-center space-x-4">
                        {error.includes("log in") && (
                            <button
                                onClick={() => navigate("/login")}
                                className="bg-indigo-600 text-white py-1.5 px-4 rounded-lg hover:bg-indigo-700"
                            >
                                Log In
                            </button>
                        )}
                        <button
                            onClick={() => {
                                setLoading(true);
                                setError(null);
                                setPosts([]);
                            }}
                            className="bg-gray-200 text-gray-700 py-1.5 px-4 rounded-lg hover:bg-gray-300"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            )}
            {!loading && !error && posts.length === 0 && (
                <p className="text-gray-500 text-center">No posts yet.</p>
            )}
            {!loading && !error && posts.length > 0 && (
                <div className="space-y-6">
                    {posts.map((post) => (
                        <div
                            key={post.postId}
                            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700"
                        >
                            <p className="text-gray-800 dark:text-gray-200 text-lg">{post.description}</p>
                            {post.imageUrl && (
                                <img
                                    src={post.imageUrl}
                                    alt="Post content"
                                    className="mt-4 max-w-full h-auto rounded-lg shadow-sm"
                                    onError={(e) => {
                                        e.target.style.display = "none";
                                    }}
                                />
                            )}
                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                                Posted on {new Date(post.createdAt).toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserPosts;